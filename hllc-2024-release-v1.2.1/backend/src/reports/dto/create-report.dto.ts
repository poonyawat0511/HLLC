import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateReportDto {
  @IsMongoId()
  reporter: ObjectId;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsMongoId()
  category: string;
}
