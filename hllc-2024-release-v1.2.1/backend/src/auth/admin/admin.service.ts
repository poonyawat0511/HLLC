import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from 'src/admins/schemas/admin.schema';
import { AccessTokenService } from '../access-token/access-token.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { Tokens } from '../interfaces/login.interface';
import { AdminRoles } from '../enums/roles.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const query = { username, role: { $in: Object.values(AdminRoles) } };
    const admin = await this.adminModel.findOne(query, { password: true });
    // Check user existing
    if (!admin || !admin.password) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    // Matching password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return await this.generateToken(admin);
  }

  async getProfile(id: string) {
    const admin = await this.adminModel
      .findById(id)
      .populate({ path: 'major', populate: { path: 'school' } })
      .lean();
    if (!admin) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return admin;
  }

  async generateToken(admin: AdminDocument): Promise<Tokens> {
    // Generate token payload
    const accessToken = await this.accessTokenService.generate({
      id: admin._id.toHexString(),
      username: admin.username,
      roles: [admin.role],
    });
    const refreshToken = await this.refreshTokenService.generate({
      token: accessToken,
      id: admin._id.toHexString(),
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const refreshPayload = await this.refreshTokenService.verify(refreshToken);
    const admin = await this.adminModel.findById(refreshPayload.id);
    if (!admin) {
      throw new UnauthorizedException('Invalid refresh credentials');
    }
    return await this.generateToken(admin);
  }
}
