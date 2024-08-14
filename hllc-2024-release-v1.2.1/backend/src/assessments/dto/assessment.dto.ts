import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
