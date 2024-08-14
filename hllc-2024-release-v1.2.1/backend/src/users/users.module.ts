import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MajorsModule } from 'src/majors/majors.module';
import { SchoolsModule } from 'src/schools/schools.module';
import { Major, MajorSchema } from 'src/majors/schemas/major.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './users.permissions';
import { ActivitiesModule } from 'src/activities/activities.module';
import {
  NotificationRead,
  ReadNotificationSchema,
} from 'src/notifications/schemas/notification-read.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { LamduansModule } from 'src/lamduans/lamduans.module';
import { CheckInsModule } from 'src/check-ins/check-ins.module';
import { ItemsModule } from 'src/items/items.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Major.name, schema: MajorSchema },
      { name: NotificationRead.name, schema: ReadNotificationSchema },
    ]),
    forwardRef(() => MajorsModule),
    forwardRef(() => SchoolsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => LamduansModule),
    forwardRef(() => CheckInsModule),
    forwardRef(() => ItemsModule),
    ActivitiesModule,
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersService,
  ],
})
export class UsersModule {}
