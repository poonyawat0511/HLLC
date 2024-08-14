import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
