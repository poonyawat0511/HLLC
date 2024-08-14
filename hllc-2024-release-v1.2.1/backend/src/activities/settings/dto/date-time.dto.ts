import { IsISO8601 } from 'class-validator';

export class DateTimeDto {
  @IsISO8601()
  start: Date | string;

  @IsISO8601()
  end: Date | string;
}
