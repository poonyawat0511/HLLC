import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentSectionDto } from './create-assessment-section.dto';

export class UpdateAssessmentSectionDto extends PartialType(
  CreateAssessmentSectionDto,
) {}
