import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from 'src/users/users.module';
import { ActivitiesModule } from 'src/activities/activities.module';
import { CheckInsModule } from 'src/check-ins/check-ins.module';
import { EvaluationsModule } from 'src/evaluations/evaluations.module';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { AssessmentSectionsModule } from 'src/assessment-sections/assessment-sections.module';
import { PretestsModule } from 'src/pretests/pretests.module';
import { PosttestsModule } from 'src/posttests/posttests.module';
import { ContestsModule } from 'src/contests/contests.module';

@Module({
  imports: [
    UsersModule,
    ActivitiesModule,
    CheckInsModule,
    EvaluationsModule,
    AssessmentsModule,
    AssessmentSectionsModule,
    PretestsModule,
    PosttestsModule,
    ContestsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
