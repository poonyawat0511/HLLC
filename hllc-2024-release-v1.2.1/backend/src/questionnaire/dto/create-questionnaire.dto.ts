import {
    IsNotEmpty,
    IsObject,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { QuestionnaireDto } from './questionnaire';
  import { Type } from 'class-transformer';
  
  export class CreateQuestionnaireDto {
    @IsObject()
    @ValidateNested()
    @Type(() => QuestionnaireDto)
    questionnaire: QuestionnaireDto;
  
    @IsString()
    @IsNotEmpty()
    type: string;
  }
  