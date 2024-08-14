import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsOptionalMongoId } from 'src/app/decorator/is-optional-mongo-id.decorator';
import { UserRound, UserType } from '../interfaces/user.interface';

class NameDto {
  @IsString()
  @IsNotEmpty()
  first: string;

  @IsOptional()
  @IsString()
  last: string;
}

export class UploadUserDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];

  @IsOptionalMongoId()
  major?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['NORMAL', 'OTHER', 'TESTER'])
  type: UserType;

  @IsString()
  @IsNotEmpty()
  @IsIn(['NORMAL', 'OTHER'])
  round: UserRound;
}

class UserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsOptionalMongoId()
  major?: string;
}
