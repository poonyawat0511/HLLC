import { Module } from '@nestjs/common';
import { ActivitySettingsService } from './activity-settings.service';
import { ActivitySettingsController } from './activity-settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivitySetting,
  ActivitySettingSchema,
} from './schemas/setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivitySetting.name, schema: ActivitySettingSchema },
    ]),
  ],
  controllers: [ActivitySettingsController],
  providers: [ActivitySettingsService],
  exports: [
    MongooseModule.forFeature([
      { name: ActivitySetting.name, schema: ActivitySettingSchema },
    ]),
    ActivitySettingsService,
  ],
})
export class ActivitySettingsModule {}
