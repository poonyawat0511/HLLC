import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsObject()
  @IsNotEmpty()
  readonly name: {
    th: string;
    en: string;
  };

  @IsString()
  @IsNotEmpty()
  readonly acronym: string;

  @IsObject()
  @IsNotEmpty()
  readonly detail: {
    th: string;
    en: string;
  };

  readonly color: {
    primary: string;
    secondary: string;
    accent: string;
  };

  readonly photos: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
}
