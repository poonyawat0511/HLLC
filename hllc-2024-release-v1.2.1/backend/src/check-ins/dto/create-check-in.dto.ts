import { IsMongoId } from 'class-validator';

export class CreateCheckInDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  activity: string;

  @IsMongoId()
  staff: string;
}
