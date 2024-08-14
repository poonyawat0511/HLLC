import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';

export class EvaluationValue {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  @IsMongoId()
  question: string;
}

export class CreateEvaluationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationValue)
  values: EvaluationValue[];

  @IsMongoId()
  author: string;

  @IsMongoId()
  activity: string;

  @NotAllowed()
  timestamp: Date;
}
