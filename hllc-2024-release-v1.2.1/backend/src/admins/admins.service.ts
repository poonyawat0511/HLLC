import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { UploadAdminDto } from './dto/upload-admin.dto';

@Injectable()
export class AdminsService {
  private errorBuilder = new ErrorBuilder('Admin');

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const adminDoc = new this.adminModel(createAdminDto);
      adminDoc.password = await bcrypt.hash(
        adminDoc.password,
        this.configService.get<number>('bcrypt.saltOrRounds'),
      );
      const admin = await adminDoc.save();
      return admin.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`User is already existing`);
      }
      throw error;
    }
  }

  async findAll(role?: string): Promise<Admin[]> {
    const admins = await this.adminModel.find(role ? { role } : {}).populate({
      path: 'major',
      select: 'name acronym',
      populate: { path: 'school', select: 'name acronym' },
    });
    return admins.map((admin) => admin.toObject());
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return admin.toObject();
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    try {
      const exists = await this.adminModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const admin = await this.adminModel.findByIdAndUpdate(
        id,
        updateAdminDto,
        {
          new: true,
        },
      );
      return admin.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Username is already existing`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Admin> {
    const admin = await this.adminModel.findByIdAndDelete(id);
    if (!admin) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return admin.toObject();
  }

  async removeMultiple(ids: string[]): Promise<Admin[]> {
    const users = await this.adminModel
      .deleteMany({ _id: { $in: ids } })
      .lean();
    if (!ids) {
      throw new NotFoundException('Ids Not Found');
    }
    return users as unknown as Admin[];
  }

  async upload(uploadAdminDto: UploadAdminDto): Promise<Admin[]> {
    const users: CreateAdminDto[] = await Promise.all(
      uploadAdminDto.users.map(async (userDto) => {
        return {
          name: {
            first: userDto.name.first,
            last: userDto.name.last,
          },
          fullName: `${userDto.name.first} ${userDto.name.last}`,
          username: userDto.username,
          password: await bcrypt.hash(
            userDto.password,
            this.configService.get<number>('bcrypt.saltOrRounds'),
          ),
          role: userDto.role,
          major: new Types.ObjectId(userDto.major)
        };
      }),
    );

    try {
      const savedUsers = await Promise.all(
        users.map(async (user) => {
          const userDoc = new this.adminModel(user);
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
}
