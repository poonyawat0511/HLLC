import { IsMongoId, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateMajorDto {
  @IsString()
  @IsNotEmpty()
  readonly acronym: string;

  @IsObject()
  @IsNotEmpty()
  readonly name: {
    th: string;
    en: string;
  };

  @IsObject()
  @IsNotEmpty()
  readonly detail: {
    th: string;
    en: string;
  };

  @IsMongoId()
  readonly school: string;
}
