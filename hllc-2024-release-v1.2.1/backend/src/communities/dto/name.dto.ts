import { IsNotEmpty, IsString } from 'class-validator';

export class Name {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
