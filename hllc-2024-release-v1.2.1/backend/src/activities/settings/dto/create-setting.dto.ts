import { Type } from 'class-transformer';
import { IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { DateTimeDto } from './date-time.dto';
import { LocalesDto } from 'src/app/common/dto/locales-dto';
import { AdminRoles } from 'src/auth/enums/roles.enum';
import { IncludeSome } from 'src/app/decorator/include-some.decorator';

export class CreateActivitySettingDto {
  @IsMongoId()
  activity: string;

  @IsMongoId()
  major: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocalesDto)
  location: { th: string; en: string };

  @IsObject()
  @ValidateNested()
  @Type(() => DateTimeDto)
  dateTime: DateTimeDto;

  @IncludeSome(Object.values(AdminRoles))
  scopes: AdminRoles;
}
