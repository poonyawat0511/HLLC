import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { HistoryDto } from './history.dto';
import { Type } from 'class-transformer';

export class CreateChatHistoryDto {
  @IsNotEmpty()
  @IsMongoId()
  room: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryDto)
  history: HistoryDto[];
}
