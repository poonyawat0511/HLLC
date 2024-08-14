import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateLamduanDto {
  lamduanImage: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  text: string;
}
