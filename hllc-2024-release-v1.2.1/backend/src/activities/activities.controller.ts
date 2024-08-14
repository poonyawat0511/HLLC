import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityEntity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AssessmentsService } from 'src/assessments/assessments.service';
import { AssessmentEntity } from 'src/assessments/entities/assessment.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { transformFile } from 'src/app/common/utils/request.util';
import { ImageValidationPipe } from 'src/app/common/validation/image.validation';
import { ActivitySettingEntity } from './settings/entities/activity-setting.entity';
import { UsersService } from 'src/users/users.service';

type UploadedFile = {
  icon?: Express.Multer.File[];
  banner?: Express.Multer.File[];
};

@Controller('activities')
export class ActivitiesController {
  private readonly messageBuilder = new MessageBuilder('Activity');

  constructor(
    private readonly activityService: ActivitiesService,
    private readonly assessmentsService: AssessmentsService,
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':activityId/assessments')
  async findQuestionsByActivityId(@Param('activityId') activityId: string) {
    const assessments =
      await this.assessmentsService.findAssessmentByActivityId(activityId);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id: activityId }),
      assessments.map((assessment) => new AssessmentEntity(assessment)),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFiles(ImageValidationPipe) files: UploadedFile,
  ) {
    // Asiign uploaded file to dto
    Object.assign(createActivityDto, {
      icon: files.icon?.[0]?.filename,
      banner: files.banner?.[0]?.filename,
    });
    const activity = await this.activityService.create(createActivityDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ActivityEntity(activity),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const activitys = await this.activityService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      activitys.map((user) => new ActivityEntity(user)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const activity = await this.activityService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ActivityEntity(activity),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':code/code')
  async findActivityByCodeAndUser(
    @Param('code') code: string,
    @Req() req: Request,
  ) {
    const user = await this.usersService.findOne(req['user'].id);
    const activity = await this.activityService.findActivitiesByCodeAndUser(
      code,
      user,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, {
        id: activity._id.toString(),
      }),
      new ActivityEntity(activity),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @UploadedFiles(ImageValidationPipe) files: UploadedFile,
  ) {
    transformFile(files.icon?.[0], updateActivityDto, 'icon');
    transformFile(files.banner?.[0], updateActivityDto, 'banner');

    const activity = await this.activityService.update(id, updateActivityDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ActivityEntity(activity),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const activity = await this.activityService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ActivityEntity(activity),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/settings')
  async getActivitySetttings(@Param('id') id: string) {
    const settings = await this.activityService.findSettingsById(id);
    return createResponse(
      HttpStatus.OK,
      `Get settings by activity id ${id} successfully`,
      settings.map((setting) => new ActivitySettingEntity(setting)),
    );
  }
}
