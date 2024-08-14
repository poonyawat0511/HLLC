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
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AdminEntity } from './entities/admin.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Admin } from './schemas/admin.schema';
import { UploadAdminDto } from './dto/upload-admin.dto';
import { userAccessGuard } from 'src/app/guards/owner.guard';
import { ActivitiesService } from 'src/activities/activities.service';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';

@Controller('admins')
export class AdminsController {
  private readonly messageBuilder = new MessageBuilder('Admin');

  constructor(
    private readonly adminsService: AdminsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Admin)
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminsService.create(createAdminDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new AdminEntity(admin),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Admin)
  @Get()
  async findAll(@Query('role') role?: string) {
    const admins = await this.adminsService.findAll(role);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      admins.map((admin) => new AdminEntity(admin)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const admin = await this.adminsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new AdminEntity(admin),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = await this.adminsService.update(id, updateAdminDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new AdminEntity(admin),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Admin)
  @Delete('multiple')
  async deleteMultipleUsers(@Body() userIds: string[]) {
    await this.adminsService.removeMultiple(userIds);
    return createResponse(HttpStatus.OK, 'Users deleted successfully');
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const admin = await this.adminsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new AdminEntity(admin),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Admin)
  @Post('upload')
  async upload(@Body() uploadAdminDto: UploadAdminDto) {
    const users = await this.adminsService.upload(uploadAdminDto);
    return createResponse(
      HttpStatus.CREATED,
      'Users have been successfully uploaded',
      users.map((user) => new AdminEntity(user)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard, userAccessGuard())
  @UseAbility(Actions.read, Activity)
  @Get(':id/activities')
  async getAdminActivities(@Param('id') id: string) {
    const admin = await this.adminsService.findOne(id);
    const activities = await this.activitiesService.getAdminActivities(admin);
    return createResponse(
      HttpStatus.OK,
      'Get admin activities successfully',
      activities.map((activity) => new ActivityEntity(activity)),
    );
  }
}
