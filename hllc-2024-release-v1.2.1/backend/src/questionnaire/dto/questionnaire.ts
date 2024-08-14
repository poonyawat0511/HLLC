import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionnaireDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
