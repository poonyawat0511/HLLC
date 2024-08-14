import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PosttestDto } from './posttest.dto';

export class CreatePosttestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosttestDto)
  values: PosttestDto[];

  @IsNotEmpty()
  readonly author: string;
}
