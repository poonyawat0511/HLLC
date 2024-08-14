import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/settings.schema';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ErrorBuilder, ErrorMethod } from 'src/app/common/utils/error.util';

@Injectable()
export class SettingsService {
  private readonly errorBuilder = new ErrorBuilder('Setting');
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const settingDoc = new this.settingModel(createSettingDto);
    const setting = await settingDoc.save();
    return setting.toObject();
  }

  async findAll(): Promise<Setting[]> {
    const settings = await this.settingModel.find().lean();
    return settings;
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingModel.findById(id).lean();
    if (!setting) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return setting;
  }

  async findOneByKey(key: string): Promise<Setting> {
    const setting = await this.settingModel.findOne({ key: key }).lean();
    if (!setting) {
      throw new NotFoundException(`Cannot find setting by key ${key}`);
    }
    return setting;
  }

  async findByGroup(group: string): Promise<Setting[]> {
    const settings = await this.settingModel.find({ group }).lean();
    return settings;
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const exists = await this.settingModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    const updatedSetting = await this.settingModel.findByIdAndUpdate(
      id,
      updateSettingDto,
      { new: true, lean: true },
    );
    return updatedSetting;
  }

  async remove(id: string): Promise<Setting> {
    const setting = await this.settingModel.findByIdAndDelete(id).lean();
    if (!setting) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return setting;
  }
}
