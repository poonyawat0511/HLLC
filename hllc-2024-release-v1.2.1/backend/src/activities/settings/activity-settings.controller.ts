import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ActivitySettingsService } from './activity-settings.service';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { CreateActivitySettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ActivitySettingEntity } from './entities/activity-setting.entity';
import {
  MessageBuilder,
  createResponse,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { ActivitySetting } from './schemas/setting.schema';

@Controller('activity-settings')
export class ActivitySettingsController {
  private readonly messageBuilder = new MessageBuilder('Activity Setting');

  constructor(
    private readonly activitySetttingService: ActivitySettingsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createAdminDto: CreateActivitySettingDto) {
    const settting = await this.activitySetttingService.create(createAdminDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ActivitySettingEntity(settting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const setttings = await this.activitySetttingService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      setttings.map((settting) => new ActivitySettingEntity(settting)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const settting = await this.activitySetttingService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ActivitySettingEntity(settting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateSettingDto,
  ) {
    const settting = await this.activitySetttingService.update(
      id,
      updateAdminDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ActivitySettingEntity(settting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const settting = await this.activitySetttingService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ActivitySettingEntity(settting),
    );
  }
}
