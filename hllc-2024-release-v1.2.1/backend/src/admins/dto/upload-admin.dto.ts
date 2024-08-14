import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPassword } from 'src/app/decorator/is-password.decorator';
import { AdminRoles } from 'src/auth/enums/roles.enum';

class NameDto {
  @IsString()
  @IsNotEmpty()
  first: string;

  @IsOptional()
  @IsString()
  last: string;
}

export class UploadAdminDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];
}

class UserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  password: string;

  @IsIn(Object.values(AdminRoles))
  role: AdminRoles;

  @IsOptional()
  @IsMongoId()
  major?: string;
}
