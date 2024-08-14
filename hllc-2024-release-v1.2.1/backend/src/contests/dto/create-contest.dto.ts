import {
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateLanguageContent,
  CreateContestArrayMember,
  CreateLanguageContentDescription,
} from './contest.dto';

export class CreateContestDto {
  @IsString()
  @IsNotEmpty()
  team: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateLanguageContent)
  category: CreateLanguageContent;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateLanguageContent)
  title: CreateLanguageContent;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateLanguageContentDescription)
  description: CreateLanguageContentDescription;

  coverImage: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContestArrayMember)
  members: CreateContestArrayMember[];

  @IsString()
  @IsNotEmpty()
  url: string;
}
