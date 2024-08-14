import { IsNotEmpty, IsString } from 'class-validator';

export class PosttestDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  assessment: string;
}
