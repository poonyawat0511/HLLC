import { IsObject, ValidateNested } from 'class-validator';
import { StickerDto } from './sticker.dto';
import { Type } from 'class-transformer';

export class CreateStickerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => StickerDto)
  name: StickerDto;

  sticker: string;
}
