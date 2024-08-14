import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './schemas/activities.schema';
import { Model } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { flattenObject } from 'src/app/common/utils/object.util';
import { ActivitySetting } from './settings/schemas/setting.schema';
import { CheckIn } from 'src/check-ins/schemas/check-ins.schema';
import { UserActivity } from './interfaces/activity.interface';
import { User } from 'src/users/schemas/user.schema';
import { Evaluation } from 'src/evaluations/schemas/evaluation.schema';
import { Admin } from 'src/admins/schemas/admin.schema';

@Injectable()
export class ActivitiesService {
  private readonly errorBuilder = new ErrorBuilder('Activity');

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(ActivitySetting.name)
    private settingModel: Model<ActivitySetting>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckIn>,
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    try {
      const activityDoc = new this.activityModel(createActivityDto);
      const activity = await activityDoc.save();
      return activity.toObject();
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

  async findAll(): Promise<Activity[]> {
    const activities = await this.activityModel.find().lean();
    return activities;
  }

  async findAllWithQuestions(): Promise<any[]> {
    const activities = await this.activityModel.find().lean();
    return activities;
  }

  async findOne(id: string): Promise<Activity> {
    try {
      const activity = await this.activityModel.findById(id).lean();
      if (!activity) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return activity;
    } catch (error) {
      throw error;
    }
  }

  async findOneByName(name: {
    th: string;
    en: string;
  }): Promise<Activity | null> {
    return this.activityModel.findOne({ name }).lean();
  }

  async findOneWithMajors(id: string): Promise<any> {
    const activity = await this.activityModel.findById(id).lean();
    return activity;
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    try {
      const exists = await this.activityModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      const activity = await this.activityModel
        .findByIdAndUpdate(
          id,
          { $set: flattenObject(updateActivityDto) },
          { new: true },
        )
        .lean();

      return activity;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }
      throw error;
    }
  }

  async findByCode(code: string): Promise<Activity> {
    const activity = await this.activityModel.findOne({ code: code }).lean();
    return activity;
  }

  async findActivitiesByCodeAndUser(
    code: string,
    user: User,
  ): Promise<UserActivity | null> {
    const activity: UserActivity | null = await this.activityModel
      .findOne({ code: code })
      .lean();
    if (!activity) {
      throw new NotFoundException(
        `Activity with ID ${activity._id} not found or not visible.`,
      );
    }
    // User Check-in for the specific activity
    const checkIn = await this.checkInModel
      .findOne({ user: user._id.toString(), activity: activity._id })
      .lean();

    // Activity Settings for the specific activity and user's major
    const assessment = await this.evaluationModel
      .findOne({ activity: activity._id, author: user._id })
      .lean();
    // Activity Settings for the specific activity and user's major
    const setting = await this.settingModel
      .findOne({ activity: activity._id, major: user.major })
      .lean();

    return this.updateActivityData({
      activity,
      checkIn,
      assessment,
      setting,
    });
  }

  async remove(id: string): Promise<Activity> {
    const activity = await this.activityModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
    if (!activity) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    return activity;
  }

  async findSettingsById(id: string): Promise<ActivitySetting[]> {
    const activity = await this.findOne(id);
    const settings = await this.settingModel
      .find({ activity: activity._id })
      .lean();
    return settings;
  }

  updateActivityData({
    activity,
    checkIn,
    assessment,
    setting,
  }: {
    activity: UserActivity;
    checkIn?: CheckIn;
    assessment?: Evaluation;
    setting: ActivitySetting;
  }) {
    // Date
    const now = new Date();
    // Assign data
    activity.checkInAt = checkIn?.timestamp ?? null;
    activity.takeAssessmentAt = assessment?.timestamp ?? null;
    activity.location = setting?.location ?? { th: '', en: '' };
    activity.dateTime = {
      start: setting?.dateTime.start ?? null,
      end: setting?.dateTime.end ?? null,
    };

    activity.status = (() => {
      // Activity is closing
      if (!activity.open) {
        return { step: 0, message: 'closing' };
      }
      // User evaluated
      if (activity.takeAssessmentAt) {
        return { step: 3, message: 'success' };
      }
      // Time line
      const isEnded = activity.dateTime.end
        ? now > new Date(activity.dateTime.end)
        : false;
      const isStarted = activity.dateTime.start
        ? now > new Date(activity.dateTime.start)
        : false;
      // Not evaluated and checked in
      if (activity.checkInAt) {
        // Check in but activity is ended
        if (isEnded) {
          return { step: 3, message: 'waiting' };
        }
        return { step: 2, message: 'waiting' };
      }
      // Not checked in and activity is started
      if (isStarted) {
        // Not checked in and activity is ended
        if (isEnded) {
          return { step: 1, message: 'failed' };
        }
        // Active started but not ended
        return { step: 1, message: 'waiting' };
      }
      // If activity is not started
      return { step: 0, message: 'not started' };
    })();

    return activity;
  }

  async getUserActivities(user: User): Promise<UserActivity[]> {
    // Get all activities
    const activities: UserActivity[] = await this.activityModel.find().lean();

    // User Check-ins
    const checkIns = await this.checkInModel
      .find({ user: user._id.toString() })
      .lean();
    const checkInsMap = new Map(
      checkIns.map((item) => [item.activity.toString(), item]),
    );

    // User Evaluation
    const evaluations = await this.evaluationModel
      .find({ author: user._id.toString() })
      .lean();
    const evaluationsMap = new Map(
      evaluations.map((item) => [item.activity.toString(), item]),
    );

    // Activity Settings
    const settings = await this.settingModel.find({ major: user.major }).lean();
    const settingsMap = new Map(
      settings.map((item) => [item.activity.toString(), item]),
    );
    // Apply data to the activity
    for (const activity of activities) {
      // Get neccessary data
      const checkIn = checkInsMap.get(activity._id.toString()) ?? null;
      const assessment = evaluationsMap.get(activity._id.toString()) ?? null;
      const setting = settingsMap.get(activity._id.toString()) ?? null;
      this.updateActivityData({ activity, checkIn, assessment, setting });
    }
    return activities;
  }

  async getUserActivityById(
    user: User,
    activityId: string,
  ): Promise<UserActivity | null> {
    try {
      const activity: UserActivity | null = await this.activityModel
        .findOne({ _id: activityId, show: true })
        .lean();
      if (!activity) {
        throw new NotFoundException(
          `Activity with ID ${activityId} not found or not visible.`,
        );
      }

      // User Check-in for the specific activity
      const checkIn = await this.checkInModel
        .findOne({ user: user._id.toString(), activity: activityId })
        .lean();

      // Activity Settings for the specific activity and user's major
      const assessment = await this.evaluationModel
        .findOne({ activity: activityId, author: user._id })
        .lean();

      // Activity Settings for the specific activity and user's major
      const setting = await this.settingModel
        .findOne({ activity: activityId, major: user.major })
        .lean();

      return this.updateActivityData({
        activity,
        checkIn,
        assessment,
        setting,
      });
    } catch (error) {
      console.error(
        `Error fetching user activity with ID ${activityId}:`,
        error,
      );
      throw error;
    }
  }

  async getAdminActivities(admin: Admin) {
    if (['ADMIN'].includes(admin.role)) {
      return await this.activityModel.find().lean();
    }

    if (!admin.major) return [];
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 15);
    endDate.setMinutes(endDate.getMinutes() - 15);

    const settings = await this.settingModel
      .find({
        major: admin.major,
        scopes: admin.role,
        'dateTime.start': { $lte: startDate },
        'dateTime.end': { $gte: endDate },
      })
      .lean();

    const activities = await this.activityModel
      .find({
        _id: { $in: settings.map((setting) => setting.activity) },
        open: true,
      })
      .select(['name'])
      .lean();

    return activities;
  }
}
