import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateGiftDto {
  @IsMongoId()
  @IsNotEmpty()
  sendergift: ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  receivergift: ObjectId;
}
