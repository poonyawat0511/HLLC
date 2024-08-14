import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-rooms.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
