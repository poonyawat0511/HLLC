import {
  IsNotEmpty,
  IsString,
  IsMongoId,
} from 'class-validator';
export class CreateAnswerQuestionDto {
  @IsMongoId()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsMongoId()
  @IsNotEmpty()
  user: string;
}
