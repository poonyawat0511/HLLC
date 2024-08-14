import { IsNotEmpty, IsString } from 'class-validator';

export class HistoryDto {
  @IsNotEmpty()
  user: string;

  @IsString()
  text: string;

  timestamp: Date;
}
