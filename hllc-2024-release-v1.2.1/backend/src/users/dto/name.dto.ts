import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  first: string;

  @IsString()
  @IsNotEmpty()
  last: string;
}
