import { Type } from 'class-transformer';
import {
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { QuestionDto } from './assessment.dto';
import {
  AssessmentStatus,
  AssessmentType,
} from '../enums/assessment-status.enum';
import { TransformType } from 'src/app/decorator/transform-type.decorator';

export class CreateAssessmentDto {
  @IsObject()
  @ValidateNested()
  @Type(() => QuestionDto)
  question: QuestionDto;

  @IsString()
  @IsIn(['PRETEST', 'POSTTEST', 'ACTIVITY'])
  status: AssessmentStatus;

  @TransformType(Number)
  @IsIn(['RATINGS', 'TEXT'])
  type: AssessmentType;

  @IsBoolean()
  @IsNotEmpty()
  required: boolean;

  @ValidateIf((o) => o.status === 'PRETEST' || o.status === 'POSTTEST')
  @IsMongoId()
  @IsNotEmpty()
  section: string;

  @ValidateIf((o) => o.status === 'ACTIVITY')
  @IsMongoId()
  @IsNotEmpty()
  activity: string;
}
