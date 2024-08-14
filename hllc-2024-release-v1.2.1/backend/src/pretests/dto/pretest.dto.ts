import { IsNotEmpty, IsString } from 'class-validator';

export class PretestDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  assessment: string;
}
