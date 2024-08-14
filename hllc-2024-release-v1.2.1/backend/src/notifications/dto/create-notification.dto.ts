import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Recipient } from '../interfaces/recipient.interface';
import { IsRecipient } from '../decorators/is-recipient.decorator';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';

class LanguageDto {
  @IsOptional()
  @IsString()
  th: string;

  @IsOptional()
  @IsString()
  en: string;
}

class RedirectDto {
  @IsOptional()
  @IsString()
  url: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LanguageDto)
  btnMessage: LanguageDto;
}

export class CreateNotificationDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LanguageDto)
  title: LanguageDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LanguageDto)
  subtitle: LanguageDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LanguageDto)
  detail: LanguageDto;

  @IsString()
  @IsNotEmpty()
  icon: string;

  image: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RedirectDto)
  redirect?: RedirectDto;

  @IsRecipient()
  recipients: 'everyone' | Recipient[];

  @NotAllowed()
  timestamp?: Date;
}
