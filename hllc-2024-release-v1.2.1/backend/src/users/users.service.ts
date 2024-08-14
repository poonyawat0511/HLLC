import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { UploadUserDto } from './dto/upload-user.dto';
import { Major } from 'src/majors/schemas/major.schema';

type FindAllUserOptions = {
  includes?: string | string[];
};

@Injectable()
export class UsersService {
  private readonly errorBuilder = new ErrorBuilder('User');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Major.name) private majorModel: Model<Major>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userDoc = new this.userModel(createUserDto);
    const user = await userDoc.save();
    return user.toObject();
  }

  async findAll(options?: FindAllUserOptions): Promise<User[]> {
    // Create promise user to prepare fetching
    const userPromise = this.userModel.find();

    if (options.includes) {
      // Transform includes array into object
      const queries = Array.isArray(options.includes)
        ? options.includes
        : [options.includes];
      const queryBlock = Object.fromEntries(queries.map((v) => [v, true]));

      // Include major with user
      if (queryBlock.major) {
        userPromise.populate({ path: 'major', populate: { path: 'school' } });
      }
    }

    return await userPromise.lean();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const exists = await this.userModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .lean();

    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).lean();
    if (!user) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return user;
  }

  async removeMultiple(ids: string[]): Promise<User[]> {
    const users = await this.userModel.deleteMany({ _id: { $in: ids } }).lean();
    if (!ids) {
      throw new NotFoundException('Ids Not Found');
    }
    return users as unknown as User[];
  } //Not Done Yet

  async findByStudentId(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password || user.password.length === 0) {
      throw new BadRequestException(`User is not registered yet`);
    }
    return user;
  }

  async resetPassword(id: string): Promise<User> {
    const userDoc = await this.userModel.findById(id).exec();

    if (!userDoc) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    userDoc.password = '';
    userDoc.secret = '';
    const updatedUser = await userDoc.save();
    return updatedUser.toObject();
  }

  async upload(uploadUserDto: UploadUserDto): Promise<User[]> {
    const users: CreateUserDto[] = await Promise.all(
      uploadUserDto.users.map(async (userDto) => {
        const userMajor = userDto.major || uploadUserDto.major;

        if (userDto.major) {
          const userMajorRecord = await this.majorModel
            .findById(userDto.major)
            .lean();
          if (!userMajorRecord) {
            throw new NotFoundException('Major in database not found');
          }
        }

        return {
          name: {
            first: userDto.name.first,
            last: userDto.name.last,
          },
          fullName: `${userDto.name.first} ${userDto.name.last}`,
          username: userDto.studentId,
          password: '',
          secret: '',
          major: userMajor,
          type: uploadUserDto.type,
          round: uploadUserDto.round,
        };
      }),
    );

    try {
      const savedUsers = await Promise.all(
        users.map(async (user) => {
          const userDoc = new this.userModel(user);
          return await userDoc.save();
        }),
      );

      return savedUsers.map((user) => user.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async checkAllRegistrations() {
    const users = await this.userModel
      .find(
        {},
        {
          'name.first': 1,
          'name.last': 1,
          type: 1,
          round: 1,
          password: 1,
          secret: 1,
        },
      )
      .lean();

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    const registeredUsers = users.filter(
      (user) => !!user.password && !!user.secret,
    );
    const notRegisteredUsers = users.filter(
      (user) => !user.password || !user.secret,
    );

    return {
      totalUsers: users.length,
      registeredUsers: registeredUsers.length,
      notRegisteredUsers: notRegisteredUsers.length,
    };
  }
}
