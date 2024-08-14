import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { CheckIn } from './schemas/check-ins.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';
import { ActivitiesService } from 'src/activities/activities.service';
import { AdminsService } from 'src/admins/admins.service';
import { ActivitySettingsService } from 'src/activities/settings/activity-settings.service';

@Injectable()
export class CheckInsService {
  private readonly errorBuilder = new ErrorBuilder('CheckIn');

  constructor(
    @InjectModel(CheckIn.name) private readonly checkInModel: Model<CheckIn>,
    private readonly notificationsService: NotificationsService,
    private readonly activitiesService: ActivitiesService,
    private readonly adminsService: AdminsService,
    private readonly activitySettingsService: ActivitySettingsService,
  ) {}

  async checkInLamduan(createCheckInDto: CreateCheckInDto) {
    try {
      const createdCheckIn = new this.checkInModel(createCheckInDto);
      const checkIn = await createdCheckIn.save();
      await checkIn.populate('activity');
      const checkInObj = checkIn.toObject();
      return checkInObj;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async create(createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    try {
      const activity = await this.activitiesService.findOne(
        createCheckInDto.activity,
      );

      if (!activity.open) {
        throw new BadRequestException(`'${activity.name.en}' is not open`);
      }

      if (activity.code === 'LAMDUAN') {
        return this.checkInLamduan(createCheckInDto);
      }

      const staff = await this.adminsService.findOne(createCheckInDto.staff);
      if (!['ADMIN'].includes(staff.role)) {
        const activitySetting =
          await this.activitySettingsService.findAvaiableByActivity(
            String(activity._id),
            String(staff.major),
          );
        if (!activitySetting) {
          throw new BadRequestException(
            `Can not check-in '${activity.name.en}' `,
          );
        }
      }

      const createdCheckIn = new this.checkInModel(createCheckInDto);
      const checkIn = await createdCheckIn.save();
      await checkIn.populate('activity');
      const checkInObj = checkIn.toObject();

      // Create notification
      await this.notificationsService.create({
        title: {
          th: 'เช็คอินกิจกรรมเสร็จสิ้น',
          en: 'Check-in activity successfully',
        },
        subtitle: { th: activity.name.th, en: activity.name.en },
        detail: {
          th: `เช็คอินกิจกรรม ${activity.name.th} เสร็จสิ้น`,
          en: `Check-in activity ${activity.name.en} successfully`,
        },
        icon: 'mdi-check-circle',
        image: activity.icon,
        recipients: [
          { type: RecipientType.individual, id: createCheckInDto.user },
        ],
        redirect: {
          btnMessage: {
            th: 'ดู',
            en: 'see',
          },
          url:
            activity.code === 'KHANTOKE'
              ? '/khantoke'
              : `/activities/${activity._id.toString()}`,
        },
      });

      this.notificationsService.notifyCheckIn({
        ...checkInObj,
        activity: activity._id,
      });

      return checkInObj;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<CheckIn[]> {
    const checkIns = await this.checkInModel
      .find()
      .populate('activity')
      .populate('user')
      .lean();
    return checkIns;
  }

  async findOne(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findById(id).lean();
    if (!checkIn) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return checkIn;
  }

  async findOneByUserAndActivity(
    userId: string,
    activityId: string,
  ): Promise<any> {
    const checkIn = await this.checkInModel
      .findOne({ user: userId, activity: activityId })
      .lean();
    return checkIn;
  }

  async findByUserId(userId: string): Promise<CheckIn[]> {
    try {
      const checkIns = await this.checkInModel
        .find({ user: userId })
        .populate('user')
        .populate('staff')
        .lean();
      return checkIns;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateCheckInDto: UpdateCheckInDto,
  ): Promise<CheckIn> {
    const exists = await this.checkInModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    const checkIn = await this.checkInModel
      .findByIdAndUpdate(id, updateCheckInDto, { new: true })
      .lean();

    return checkIn;
  }

  async remove(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findByIdAndDelete(id).lean();
    if (!checkIn) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return checkIn;
  }
}
