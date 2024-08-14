import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class QuestionDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  questionnaire: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class CreateAnswerQueDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  sender: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  receiver: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
