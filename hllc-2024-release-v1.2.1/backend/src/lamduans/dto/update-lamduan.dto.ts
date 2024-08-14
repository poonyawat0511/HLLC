import { PartialType } from '@nestjs/swagger';
import { CreateLamduanDto } from './create-lamduan.dto';

export class UpdateLamduanDto extends PartialType(CreateLamduanDto) {}
