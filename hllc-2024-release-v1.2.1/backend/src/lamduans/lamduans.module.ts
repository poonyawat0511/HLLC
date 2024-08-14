import { forwardRef, Module } from '@nestjs/common';
import { LamduansService } from './lamduans.service';
import { LamduansController } from './lamduans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lamduan, LamduanSchema } from './schemas/lamduan.schema';
import { UsersModule } from 'src/users/users.module';
import { permissions } from './lamduans.permissions';
import { CaslModule } from 'nest-casl';
import { ActivitiesModule } from 'src/activities/activities.module';
import { CheckInsModule } from 'src/check-ins/check-ins.module';
import { EvaluationsModule } from 'src/evaluations/evaluations.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lamduan.name, schema: LamduanSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => ActivitiesModule),
    forwardRef(() => CheckInsModule),
    forwardRef(() => EvaluationsModule),
    forwardRef(() => NotificationsModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [LamduansController],
  providers: [LamduansService],
  exports: [
    MongooseModule.forFeature([{ name: Lamduan.name, schema: LamduanSchema }]),
    LamduansService,
  ],
})
export class LamduansModule {}
