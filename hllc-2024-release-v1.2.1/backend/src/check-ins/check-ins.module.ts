import { forwardRef, Module } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CheckInsController } from './check-ins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckIn, CheckInSchema } from './schemas/check-ins.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ActivitySettingsModule } from 'src/activities/settings/activity-settings.module';
import { AdminsModule } from 'src/admins/admins.module';
import { ActivitiesModule } from 'src/activities/activities.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CheckIn.name, schema: CheckInSchema }]),
    NotificationsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => ActivitiesModule),
    forwardRef(() => ActivitySettingsModule),
  ],
  controllers: [CheckInsController],
  providers: [CheckInsService],
  exports: [
    MongooseModule.forFeature([{ name: CheckIn.name, schema: CheckInSchema }]),
    CheckInsService,
  ],
})
export class CheckInsModule {}
