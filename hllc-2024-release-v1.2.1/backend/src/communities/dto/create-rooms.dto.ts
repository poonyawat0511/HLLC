import {
  IsBoolean,
  IsObject,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Name } from './name.dto';
import { Type } from 'class-transformer';
import { TransformType } from 'src/app/decorator/transform-type.decorator';

export class CreateRoomDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Name)
  name: Name;

  @IsString()
  people: string;

  roomImage: string;

  @IsOptional()
  @TransformType(Boolean)
  @IsBoolean()
  saveHistory: boolean;
}
