import { IsNotEmpty, IsString } from 'class-validator';

export class TitleDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
