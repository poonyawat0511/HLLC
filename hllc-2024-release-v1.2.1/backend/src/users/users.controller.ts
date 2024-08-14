import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  UseInterceptors,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadUserDto } from './dto/upload-user.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { User } from './schemas/user.schema';
import { Activity } from 'src/activities/schemas/activities.schema';
import { userAccessGuard } from 'src/app/guards/owner.guard';
import { Roles } from 'src/auth/enums/roles.enum';
import { ActivitiesService } from 'src/activities/activities.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import { LamduansService } from 'src/lamduans/lamduans.service';
import { LamduanEntity } from 'src/lamduans/entities/lamduan.entity';
import { CheckInsService } from 'src/check-ins/check-ins.service';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/schemas/item.schema';
import { UserActivityEntity } from './entities/user-activity.entity';
import { UserItemEntity } from './entities/user-item.entity';

@Controller('users')
export class UsersController {
  private readonly messageBuilder = new MessageBuilder('User');

  constructor(
    private readonly userService: UsersService,
    private readonly activitiesService: ActivitiesService,
    private readonly lamduansService: LamduansService,
    private readonly notificationsService: NotificationsService,
    private readonly checkInsService: CheckInsService,
    private readonly itemsService: ItemsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, User)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, User)
  @Get()
  async findAll(@Query('includes') includes?: string | string[]) {
    const users = await this.userService.findAll({ includes });
    const userEntities = users.map((user) => new UserEntity(user));
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      userEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, User)
  @Get('checkRegistration')
  async checkRegistrationCounts() {
    const checkRegistration = await this.userService.checkAllRegistrations();
    return createResponse(
      HttpStatus.OK,
      'Get user registration counts successfully',
      checkRegistration,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard, userAccessGuard({ role: Roles.USER }))
  @UseAbility(Actions.read, User)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, User)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search/:username')
  async findByStudentId(@Param('username') username: string) {
    const user = await this.userService.findByStudentId(username);
    return createResponse(
      HttpStatus.OK,
      'Search user successfully',
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/reset-password')
  async resetPaawordUser(@Param('id') id: string) {
    const user = await this.userService.resetPassword(id);
    return createResponse(
      HttpStatus.OK,
      'User reset password successfully',
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, User)
  @Delete('multiple')
  async deleteMultipleUsers(@Body() userIds: string[]) {
    await this.userService.removeMultiple(userIds);
    return createResponse(HttpStatus.OK, 'Users deleted successfully');
  } // Not Done The Result Return what does it deleted yet

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, User)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id.toString());
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new UserEntity(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, User)
  @Post('upload')
  async upload(@Body() uploadUserDto: UploadUserDto) {
    const users = await this.userService.upload(uploadUserDto);
    return createResponse(
      HttpStatus.CREATED,
      'Users have been successfully uploaded',
      users,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard, userAccessGuard({ role: Roles.USER }))
  @UseAbility(Actions.read, Activity)
  @Get(':id/activities')
  async getUserActivities(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    const activities = await this.activitiesService.getUserActivities(user);
    return createResponse(
      HttpStatus.OK,
      'Get user activities successfully',
      activities.map((activity) => new UserActivityEntity(activity)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Activity)
  @Get(':userId/activities/:activityId')
  async getUserActivityById(
    @Param('userId') userId: string,
    @Param('activityId') activityId: string,
  ) {
    const user = await this.userService.findOne(userId);
    const activity = await this.activitiesService.getUserActivityById(
      user,
      activityId,
    );
    return createResponse(
      HttpStatus.OK,
      `Get user activity ${activityId} successfully`,
      new UserActivityEntity(activity),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/notifications')
  async getReadNotification(@Param('id') id: string) {
    const notifications =
      await this.notificationsService.getUserNotifications(id);
    return createResponse(
      HttpStatus.OK,
      'Get all notifications successfully',
      notifications.map((noti) => new NotificationEntity(noti)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':userId/lamduans')
  async findLamduanByuserId(@Param('userId') userId: string) {
    const lamduans = await this.lamduansService.findByUserId(userId);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id: userId }),
      new LamduanEntity(lamduans),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard, userAccessGuard({ role: Roles.USER }))
  @UseAbility(Actions.read, Item)
  @Get(':id/items')
  async getUserItems(@Param('id') id: string) {
    const items = await this.itemsService.findUserItems(id);

    return createResponse(
      HttpStatus.OK,
      'Get user activities successfully',
      items.map((item) => new UserItemEntity(item)),
    );
  }
}
