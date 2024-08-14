import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';
import { AdminRoles } from 'src/auth/enums/roles.enum';
import { IsPassword } from 'src/app/decorator/is-password.decorator';
import { IUserName } from 'src/users/interfaces/user.interface';
import { Types } from 'mongoose';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  first: string;

  @IsString()
  @IsNotEmpty()
  last: string;
}

export class CreateAdminDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: IUserName;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  password: string;

  @NotAllowed()
  fullName: string;

  @IsIn(Object.values(AdminRoles))
  role: AdminRoles;

  @IsOptional()
  @IsMongoId()
  major?: Types.ObjectId;
}
