import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createResponse } from 'src/app/common/utils/response.util';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { RefreshDto } from './dto/refresh.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Request } from 'express';
import { ProfileEntity } from './entities/profile.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async create(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);
    return createResponse(HttpStatus.OK, 'Login user successful', response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.register(registerDto);
    return createResponse(
      HttpStatus.OK,
      'Register user Successfully',
      response,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getProgile(@Req() req: any) {
    const user = await this.authService.getProfile(req.user.id);
    return new ProfileEntity(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Body() refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const response = await this.authService.refreshToken(refreshToken);

    return createResponse(
      HttpStatus.OK,
      'Refresh token Successfully',
      response,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const response = await this.authService.resetPassword(resetPasswordDto);
    return createResponse(
      HttpStatus.OK,
      'Reset password Successfully',
      response,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('register/check/:username')
  async checkRegistration(@Param('username') username: string) {
    const { user, isRegistered } =
      await this.authService.checkRegistration(username);
    return createResponse(HttpStatus.OK, 'Check user Successfully', {
      user: new UserEntity(user),
      isRegistered,
    });
  }
}
