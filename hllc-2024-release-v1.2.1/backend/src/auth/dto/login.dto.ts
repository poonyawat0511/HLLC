import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdminRoles } from '../enums/roles.enum';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(Object.values(AdminRoles), {each: true})
  role: AdminRoles[];
}
