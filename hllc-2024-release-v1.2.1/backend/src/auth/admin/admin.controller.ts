import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from '../dto/login.dto';
import { createResponse } from 'src/app/common/utils/response.util';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { RefreshDto } from '../dto/refresh.dto';
import { Request } from 'express';

@Controller('auth/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async create(@Body() loginDto: LoginDto) {
    const response = await this.adminService.login(loginDto);
    return createResponse(HttpStatus.OK, 'Login user successful', response);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getProgile(@Req() req: any) {
    const admin = await this.adminService.getProfile(req.user.id);
    return new AdminEntity(admin);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Body() refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const response = await this.adminService.refreshToken(refreshToken);
    return createResponse(
      HttpStatus.OK,
      'Refresh token Successfully',
      response,
    );
  }
}
