import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenModule } from 'src/auth/access-token/access-token.module';
import { RefreshTokenModule } from 'src/auth/refresh-token/refresh-token.module';
import { UsersModule } from 'src/users/users.module';
import { PretestsModule } from 'src/pretests/pretests.module';
import { PosttestsModule } from 'src/posttests/posttests.module';
import { SchoolsModule } from 'src/schools/schools.module';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    AccessTokenModule,
    RefreshTokenModule,
    UsersModule,
    AdminModule,
    PretestsModule,
    PosttestsModule,
    SchoolsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthenticatedGuard],
  exports: [AuthenticatedGuard, AccessTokenModule, RefreshTokenModule],
})
export class AuthModule {}
