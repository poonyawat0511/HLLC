import { IsObject, ValidateNested } from 'class-validator';
import { TitleDto } from './title';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TitleDto)
  title: TitleDto;

  @IsObject()
  @ValidateNested()
  @Type(() => TitleDto)
  text: TitleDto;

  image: string;
}
