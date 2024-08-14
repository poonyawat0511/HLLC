import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NameDto } from './name.dto';
import { Type } from 'class-transformer';
import { NotAllowed } from 'src/app/decorator/not-allowed.decorator';
import { UserRound, UserType } from '../interfaces/user.interface';

export class CreateUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsMongoId()
  major: string;

  @NotAllowed()
  secret: string;

  @NotAllowed()
  password: string;

  @NotAllowed()
  fullName: string;

  @IsOptional()
  @IsIn(['NORMAL', 'OTHER', 'TESTER'])
  type: UserType;

  @IsOptional()
  @IsIn(['NORMAL', 'OTHER'])
  round: UserRound;
}
