import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenService } from 'src/auth/refresh-token/refresh-token.service';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from './enums/roles.enum';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Pretest } from 'src/pretests/schemas/pretest.schema';
import { Posttest } from 'src/posttests/schemas/posttest.schema';
import { SchoolsService } from '../schools/schools.service';
import { Major } from '../majors/schemas/major.schema';
import School from 'src/schools/interfaces/school.interface';
import { Tokens } from './interfaces/login.interface';
import { Theme } from 'src/themes/schemas/theme.schema';
import { Profile } from './interfaces/profile.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Pretest.name)
    private readonly pretestModel: Model<Pretest>,
    @InjectModel(Posttest.name)
    private readonly posttestModel: Model<Posttest>,
    @Inject(forwardRef(() => SchoolsService))
    private schoolService: SchoolsService,
    private readonly configService: ConfigService,
  ) {}

  private get saltOrRounds(): string {
    return this.configService.get<string>('bcrypt.saltOrRounds');
  }

  async generateToken(user: UserDocument): Promise<Tokens> {
    // Generate token payload
    const accessToken = await this.accessTokenService.generate({
      id: user._id.toString(),
      username: user.username,
      roles: [Roles.USER],
    });
    const refreshToken = await this.refreshTokenService.generate({
      token: accessToken,
      id: user._id.toString(),
    });
    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne(
      { username },
      { password: true, username: true, secret: true },
    );
    // Check user existing
    if (!user || !user.password || !user.secret) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    // Matching password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return await this.generateToken(user);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password, confirmPassword, secret } = registerDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('Cannot register unknown user');
    }
    if (user.password && user.secret) {
      throw new ConflictException(`Username ${username} is already registered`);
    }
    if (password !== confirmPassword) {
      throw new BadRequestException(
        "Password and confirm password doesn't match",
      );
    }
    user.password = await bcrypt.hash(password, this.saltOrRounds);
    user.secret = await bcrypt.hash(secret, this.saltOrRounds);
    const registeredUser = await user.save();
    return registeredUser.toObject();
  }

  async getProfile(id: string): Promise<Profile> {
    const user = await this.userModel
      .findById(id)
      .populate({ path: 'major', populate: { path: 'school' } })
      .lean();
    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    const pretest = await this.getPretest(id);
    const posttest = await this.getPosttest(id);

    const theme = await (async () => {
      const major = user.major as
        | (FlattenMaps<Major> & { school?: FlattenMaps<School> })
        | undefined;
      if (major?.school?._id) {
        const theme = await this.getTheme(major.school._id.toString());
        return theme;
      }
    })();

    // Merge user object with usersProgress
    const userProfile = {
      ...user,
      pretest,
      posttest,
      theme,
    };

    return userProfile;
  }

  async refreshToken(refreshToken: string) {
    const refreshPayload = await this.refreshTokenService.verify(refreshToken);
    const user = await this.userModel.findById(refreshPayload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh credentials');
    }
    return await this.generateToken(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const userDoc = await this.userModel
      .findOne({ username: resetPasswordDto.username }, [
        'username',
        'password',
        'secret',
      ])
      .lean();
    if (!userDoc) {
      throw new UnauthorizedException('Cannot reset password of unknown user');
    }

    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new UnauthorizedException('Password not match');
    }

    const isSecretMatch = await bcrypt.compare(
      resetPasswordDto.secret,
      userDoc.secret,
    );
    if (!isSecretMatch) {
      throw new UnauthorizedException('Invalid user secret');
    }
    const newPassword = await bcrypt.hash(
      resetPasswordDto.password,
      this.saltOrRounds,
    );
    await this.userModel.updateOne(
      { username: resetPasswordDto.username },
      { password: newPassword },
    );
    return true;
  }

  async checkRegistration(username: string) {
    const user = await this.userModel
      .findOne(
        { username },
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
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, isRegistered: !!user.password && !!user.secret };
  }

  async getPretest(id: string): Promise<0 | 1> {
    try {
      const pretest = await this.pretestModel.exists({ author: id });
      return pretest?._id ? 1 : 0;
    } catch (error) {
      throw error;
    }
  }

  async getPosttest(id: string): Promise<0 | 1> {
    try {
      const posttest = await this.posttestModel.exists({ author: id });
      return posttest?._id ? 1 : 0;
    } catch (error) {
      throw error;
    }
  }

  async getTheme(schoolId: string): Promise<Theme> {
    try {
      const theme = await this.schoolService.findSchoolTheme(schoolId);
      return theme;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }
}
