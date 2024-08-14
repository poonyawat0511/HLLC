import { PartialType } from '@nestjs/swagger';
import { CreateAnswerQuestionDto } from './create-answer-question.dto';

export class UpdateAnswerQuestionDto extends PartialType(CreateAnswerQuestionDto) {}
