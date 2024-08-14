import { IsNotEmpty, IsString } from 'class-validator';

export class ReportCategoryName {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}
