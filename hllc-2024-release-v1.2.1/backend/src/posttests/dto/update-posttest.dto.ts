import { PartialType } from '@nestjs/swagger';
import { CreatePosttestDto } from './create-posttest.dto';

export class UpdatePosttestDto extends PartialType(CreatePosttestDto) {}
