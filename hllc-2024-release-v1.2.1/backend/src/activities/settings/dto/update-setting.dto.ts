import { PartialType } from '@nestjs/swagger';
import { CreateActivitySettingDto } from './create-setting.dto';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OptionalLocalesDto } from 'src/app/common/dto/locales-dto';
import { DateTimeDto } from './date-time.dto';

export class UpdateSettingDto extends PartialType(CreateActivitySettingDto) {
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  location: { th: string; en: string };

  @IsObject()
  @ValidateNested()
  @Type(() => DateTimeDto)
  dateTime: DateTimeDto;
}
