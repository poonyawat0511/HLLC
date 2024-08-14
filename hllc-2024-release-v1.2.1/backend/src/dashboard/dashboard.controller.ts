import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { createResponse } from 'src/app/common/utils/response.util';
import { ProgressEntity } from './entities/progress.entity';
import { AssessmentStatus } from 'src/assessments/enums/assessment-status.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { ActivityEntity } from 'src/activities/entities/activity.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/progress')
  async getUserProgress(
    @Query('school') school: string,
    @Query('major') major: string,
  ) {
    const query = {};
    if (school) {
      if (Array.isArray(school)) {
        query['school'] = { $in: school };
      } else {
        query['school'] = school;
      }
    }
    if (major && !school) {
      if (Array.isArray(major)) {
        query['major'] = { $in: major };
      } else {
        query['major'] = major;
      }
    }
    const response = await this.dashboardService.getUserProgress(query);
    return createResponse(
      HttpStatus.OK,
      'Get progress dashboard',
      response.map((item) => new ProgressEntity(item)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:status(pretest|posttest)')
  async getAssessmentSummary(@Param('status') status: 'pretest' | 'posttest') {
    const target = (() => {
      switch (status) {
        case 'pretest':
          return AssessmentStatus.pretest;
        case 'posttest':
          return AssessmentStatus.posttest;
      }
    })();
    const { headers, values } =
      await this.dashboardService.getAssessmentSummary(target);
    return createResponse(HttpStatus.OK, 'Get progress dashboard', {
      headers,
      values: values.map((value) => new UserEntity(value)),
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/evaluations')
  async getEvaluationSummary() {
    const { activities, values } =
      await this.dashboardService.getEvaluationsSummary();
    return createResponse(HttpStatus.OK, 'Get evaluation dashboard', {
      activities: activities.map((activity) => new ActivityEntity(activity)),
      values: values.map((value) => new UserEntity(value)),
    });
  }
}
