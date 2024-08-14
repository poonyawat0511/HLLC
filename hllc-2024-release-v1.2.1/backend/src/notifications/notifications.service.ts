import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { NotificationGateway } from './notifications.gateway';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { NotificationRead } from './schemas/notification-read.schema';
import { NotificationReadDto } from './dto/notification-read.dto';
import { RecipientType } from './enums/notificaton-target.enum';
import { User } from 'src/users/schemas/user.schema';
import { Major } from 'src/majors/schemas/major.schema';
import { School } from 'src/schools/schemas/school.schema';
import { CheckIn } from 'src/check-ins/schemas/check-ins.schema';
import { plainToInstance } from 'class-transformer';
import { CheckInEntity } from 'src/check-ins/entities/check-in.entity';

@Injectable()
export class NotificationsService {
  private notificationGateway: NotificationGateway;
  private readonly errorBuilder = new ErrorBuilder('Notification');
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @InjectModel(NotificationRead.name)
    private readNotificationModel: Model<NotificationRead>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
    @InjectModel(Major.name)
    private majorModel: Model<Major>,
  ) {}

  setGateway(gateway: NotificationGateway) {
    this.notificationGateway = gateway;
  }

  notifyCheckIn(checkIn: CheckIn) {
    this.notificationGateway.server
      .to(checkIn.user.toString())
      .emit('checkIn', plainToInstance(CheckInEntity, checkIn));
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    // Save notification
    if (createNotificationDto.recipients !== 'everyone') {
      createNotificationDto.recipients = createNotificationDto.recipients.map(
        (item) => ({ type: item.type, id: item.id }),
      );
    }
    const notificationDoc = new this.notificationModel(createNotificationDto);
    const notification = await notificationDoc.save();
    const notificationObj = notification.toObject();

    // Emit notification with synchronization
    this.notificationGateway.emitNotification(notificationObj);

    return notificationObj;
  }

  async findAll(options?: {
    includeRecipients: boolean;
  }): Promise<Notification[]> {
    const projection = options?.includeRecipients ? {} : { recipient: 0 };
    const notifications = await this.notificationModel
      .find({}, projection)
      .lean();

    if (options?.includeRecipients) {
      for (const notification of notifications) {
        if (Array.isArray(notification.recipients)) {
          for (const recipient of notification.recipients) {
            if (recipient.type === 'SCHOOL') {
              recipient.id = await this.schoolModel
                .findById(recipient.id)
                .select(['acronym'])
                .lean();
            } else if (recipient.type === 'MAJOR') {
              recipient.id = await this.majorModel
                .findById(recipient.id)
                .select(['acronym'])
                .lean();
            } else if (recipient.type === 'INDIVIDUAL') {
              recipient.id = await this.userModel
                .findById(recipient.id)
                .select(['name'])
                .lean();
            }
          }
        }
      }
    }

    return notifications;
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).lean();
    if (!notification) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return notification;
  }

  async remove(id: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findByIdAndDelete(id)
      .lean();
    if (!notification) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return notification;
  }

  async read(notificationRead: NotificationReadDto): Promise<NotificationRead> {
    const { user, notification } = notificationRead;

    const readNotification = await this.readNotificationModel
      .findOne({ user })
      .exec();

    if (readNotification) {
      const notificationId = new Types.ObjectId(notification);

      if (
        !readNotification.notifications.some((id) => id.equals(notificationId))
      ) {
        readNotification.notifications.push(notificationId);
        return await readNotification.save();
      } else {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }
    } else {
      const newReadNotification = new this.readNotificationModel({
        user: new Types.ObjectId(user),
        notifications: [new Types.ObjectId(notification)],
      });

      return await newReadNotification.save();
    }
  }

  async getUserMeta(id: string) {
    const user: User & { major: Major & { school: School } } =
      await this.userModel
        .findById(id)
        .select(['major'])
        .populate({ path: 'major', select: ['_id', 'school'] })
        .lean();
    if (!user) return null;
    return {
      id: user._id.toString(),
      major: user.major?._id?.toString(),
      school: user.major?.school?._id?.toString(),
    };
  }

  async getUserNotifications(
    userId: string,
  ): Promise<(Notification & { read: boolean })[]> {
    // Get user notification meta
    const user = await this.getUserMeta(userId);

    // Get notifications that user are in the recipients
    const notifications = await this.notificationModel
      .find({
        $or: [
          { recipients: 'everyone' },
          {
            recipients: {
              type: RecipientType.individual,
              id: user.id,
            },
          },
          {
            recipients: {
              type: RecipientType.school,
              id: user.school,
            },
          },
          {
            recipients: {
              type: RecipientType.major,
              id: user.major,
            },
          },
        ],
      })
      .select(['-recipients'])
      .lean();

    // Check user read notifications.
    const reads = await this.readNotificationModel
      .findOne({ user: user.id })
      .lean();

    // Return all with unread
    if (!reads?.notifications) {
      return notifications.map((item) => ({ ...item, read: false }));
    }

    // Apply read notifications to map for ease of getting
    const readMap = new Map(
      reads.notifications.map((item) => [item.toString(), true]),
    );

    // Map notification with read status
    return notifications.map((item) => ({
      ...item,
      read: readMap.get(item._id.toString()) ?? false,
    }));
  }
}
