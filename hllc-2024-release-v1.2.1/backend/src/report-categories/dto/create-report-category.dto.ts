import { IsObject, ValidateNested } from 'class-validator';
import { ReportCategoryName } from './report-category-name.dto';
import { Type } from 'class-transformer';

export class CreateReportCategoryDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ReportCategoryName)
  name: ReportCategoryName;
}

export { ReportCategoryName };
