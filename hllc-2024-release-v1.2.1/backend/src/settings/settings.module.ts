import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schemas/settings.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './settings.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    SettingsService,
  ],
})
export class SettingsModule {}
