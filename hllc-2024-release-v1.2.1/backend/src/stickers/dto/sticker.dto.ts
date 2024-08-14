import { IsNotEmpty, IsString } from 'class-validator';

export class StickerDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
