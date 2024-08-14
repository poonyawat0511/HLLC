import { IsObject, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateThemeDto {
  @IsMongoId()
  @IsNotEmpty()
  school: string;

  @IsObject()
  @IsNotEmpty()
  colors: Record<string, string>;

  @IsObject()
  @IsNotEmpty()
  assets: Record<string, string>;
}
