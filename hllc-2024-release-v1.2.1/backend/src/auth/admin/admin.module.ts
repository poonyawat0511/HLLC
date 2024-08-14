import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { AccessTokenModule } from '../access-token/access-token.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [AdminsModule, AccessTokenModule, RefreshTokenModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
