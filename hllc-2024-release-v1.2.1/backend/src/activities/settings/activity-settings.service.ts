import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivitySettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { Model } from 'mongoose';
import { ActivitySetting } from './schemas/setting.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ActivitySettingsService {
  private errorBuilder = new ErrorBuilder('Activity Setting');

  constructor(
    @InjectModel(ActivitySetting.name)
    private readonly activitySetttingModel: Model<ActivitySetting>,
  ) {}

  async create(
    createActivitySettingDto: CreateActivitySettingDto,
  ): Promise<ActivitySetting> {
    try {
      const setttingDoc = new this.activitySetttingModel(
        createActivitySettingDto,
      );
      const settting = await setttingDoc.save();
      return settting.toObject();
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

  async findAll(): Promise<ActivitySetting[]> {
    const setttings = await this.activitySetttingModel.find();
    return setttings.map((settting) => settting.toObject());
  }

  async findOne(id: string): Promise<ActivitySetting> {
    const settting = await this.activitySetttingModel.findById(id).lean();
    if (!settting) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return settting;
  }

  async findAvaiableByActivity(
    activityId: string,
    majorId: string,
  ): Promise<ActivitySetting> {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 15);
    endDate.setMinutes(endDate.getMinutes() - 15);

    const setting = await this.activitySetttingModel
      .findOne({
        activity: activityId,
        major: majorId,
        'dateTime.start': { $lte: startDate },
        'dateTime.end': { $gte: endDate },
      })
      .lean();

    return setting;
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<ActivitySetting> {
    try {
      const exists = await this.activitySetttingModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const settting = await this.activitySetttingModel
        .findByIdAndUpdate(id, updateSettingDto, {
          new: true,
        })
        .lean();
      return settting;
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

  async remove(id: string): Promise<ActivitySetting> {
    const settting = await this.activitySetttingModel
      .findByIdAndDelete(id)
      .lean();
    if (!settting) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return settting;
  }
}
