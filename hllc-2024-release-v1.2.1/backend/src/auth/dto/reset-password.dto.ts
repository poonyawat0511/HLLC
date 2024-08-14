import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from 'src/app/decorator/is-password.decorator';
import { IsUsername } from 'src/app/decorator/is-username.decorator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsUsername()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}
