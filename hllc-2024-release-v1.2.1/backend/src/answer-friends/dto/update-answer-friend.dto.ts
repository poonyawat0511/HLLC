import { PartialType } from '@nestjs/swagger';
import { CreateAnswerQueDto } from './create-answer-friend.dto';

export class UpdateAnswerFriendDto extends PartialType(CreateAnswerQueDto) {}
