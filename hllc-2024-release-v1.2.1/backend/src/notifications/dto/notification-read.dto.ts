import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class NotificationReadDto {
  @IsNotEmpty()
  @IsMongoId()
  user: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  notification: Types.ObjectId;
}
