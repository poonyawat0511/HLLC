import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { NotificationGateway } from './notifications.gateway';
import {
  NotificationRead,
  ReadNotificationSchema,
} from './schemas/notification-read.schema';
import { AccessTokenModule } from 'src/auth/access-token/access-token.module';
import { UsersModule } from 'src/users/users.module';
import { MajorsModule } from 'src/majors/majors.module';
import { SchoolsModule } from 'src/schools/schools.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationRead.name, schema: ReadNotificationSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => MajorsModule),
    forwardRef(() => SchoolsModule),
    AccessTokenModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationGateway],
  exports: [
    MongooseModule.forFeature([
      { name: NotificationRead.name, schema: ReadNotificationSchema },
    ]),
    NotificationsService,
  ],
})
export class NotificationsModule {}
