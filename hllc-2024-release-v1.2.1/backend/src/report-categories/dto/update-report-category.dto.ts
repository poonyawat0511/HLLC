import { PartialType } from '@nestjs/swagger';
import { ReportCategoryName } from './create-report-category.dto';

export class UpdateReportCategoryDto extends PartialType(ReportCategoryName) {
  readonly name?: {
    readonly th: string;
    readonly en: string;
  };
}
