import { PartialType } from '@nestjs/swagger';
import { CreatePretestDto } from './create-pretest.dto';

export class UpdatePretestDto extends PartialType(CreatePretestDto) {}
