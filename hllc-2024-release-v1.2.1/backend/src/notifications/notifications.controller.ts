import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationReadDto } from './dto/notification-read.dto';

@Controller('notifications')
export class NotificationsController {
  private readonly messageBuilder = new MessageBuilder('Notification');

  constructor(private readonly notificationsService: NotificationsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
      storage: storageConfig,
    }),
  )
  @Post()
  async createNotification(
    @UploadedFiles()
    files: { image?: Express.Multer.File[] },
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    createNotificationDto.image = files?.image?.[0].filename;
    const notification = await this.notificationsService.create(
      createNotificationDto,
    );

    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new NotificationEntity(notification),
    );
  }

  @Post('read')
  @UseInterceptors(ClassSerializerInterceptor)
  async readNotification(@Body() reeadNotificationDto: NotificationReadDto) {
    await this.notificationsService.read(reeadNotificationDto);
    return createResponse(
      HttpStatus.CREATED,
      'Read notification successfully',
      null,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllNotifications(@Query('includes') includes?: string) {
    const includeRecipients = includes === 'recipients';
    const notifications = await this.notificationsService.findAll({
      includeRecipients,
    });
    
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      notifications.map((notification) => new NotificationEntity(notification)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getNotification(@Param('id') id: string) {
    const notification = await this.notificationsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new NotificationEntity(notification),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedNotification = await this.notificationsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new NotificationEntity(deletedNotification),
    );
  }
}
