import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLanguageContent {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class CreateContestArrayMember {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}

export class CreateLanguageContentDescription {
  @IsOptional()
  @IsString()
  th: string;

  @IsOptional()
  @IsString()
  en: string;
}
