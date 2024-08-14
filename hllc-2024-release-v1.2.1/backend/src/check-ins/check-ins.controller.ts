import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { CheckInEntity } from './entities/check-in.entity';
import { AdminsService } from 'src/admins/admins.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { ActivitySettingsService } from 'src/activities/settings/activity-settings.service';
import { UsersService } from 'src/users/users.service';

@Controller('check-ins')
export class CheckInsController {
  private readonly messageBuilder = new MessageBuilder('CheckIn');

  constructor(
    private readonly checkInsService: CheckInsService,
    private readonly userService: UsersService,
    private readonly adminsService : AdminsService,
    private readonly activitiesService : ActivitiesService,
    private readonly activitySettingsService : ActivitySettingsService,

  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createCheckInDto: CreateCheckInDto) {
    const checkIn = await this.checkInsService.create(createCheckInDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new CheckInEntity(checkIn),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const checkIns = await this.checkInsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      checkIns.map((checkIn) => new CheckInEntity(checkIn)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.checkInsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new CheckInEntity(result),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCheckInDto: UpdateCheckInDto,
  ) {
    const checkIn = await this.checkInsService.update(id, updateCheckInDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new CheckInEntity(checkIn),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const result = await this.checkInsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new CheckInEntity(result),
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search/:userId')
  async findByUserId(@Param('userId') id: string) {
    const checkIns = await this.checkInsService.findByUserId(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      checkIns.map((checkIn) => new CheckInEntity(checkIn)),
    );
  }
}
