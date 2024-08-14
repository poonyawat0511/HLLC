import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateSettingValue } from '../decorator/validate-setting-value.decorator';
import { SettingType } from '../types/setting';
import { settingTypes } from '../schemas/settings.schema';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsIn(settingTypes)
  type: SettingType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  group?: string;

  @IsOptional()
  @ValidateSettingValue()
  value?: string;
}
