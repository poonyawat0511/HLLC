import { Module, forwardRef } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './schemas/activities.schema';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { ActivitySettingsModule } from './settings/activity-settings.module';
import { CheckInsModule } from 'src/check-ins/check-ins.module';
import { UsersModule } from 'src/users/users.module'
import { EvaluationsModule } from 'src/evaluations/evaluations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    forwardRef(() => AssessmentsModule),
    forwardRef(() => UsersModule),
    ActivitySettingsModule,
    CheckInsModule,
    EvaluationsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    ActivitiesService,
    ActivitySettingsModule, 
  ],
})
export class ActivitiesModule {}
