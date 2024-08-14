import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { AnswerFriendsService } from './answer-friends.service';
import { CreateAnswerQueDto } from './dto/create-answer-friend.dto';
import { AnswerQueEntity } from './entities/answer-friend.entity';

@Controller('answer-friends')
export class AnswerQuesController {
  private readonly messageBuilder = new MessageBuilder('AnswerQues');

  constructor(
    private readonly answerQuesService: AnswerFriendsService,
  ) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createAnswerQueDto: CreateAnswerQueDto) {
    const answerQue = await this.answerQuesService.create(createAnswerQueDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new AnswerQueEntity(answerQue),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const answerQues = await this.answerQuesService.findAll();
    const answerQueEntities = answerQues.map(
      (answerQue) => new AnswerQueEntity(answerQue),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      answerQueEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const answerQue = await this.answerQuesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new AnswerQueEntity(answerQue),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('receiver/:id')
  async fineByStudentId(@Param('id') id: string) {
    const answerQue = await this.answerQuesService.fineByStudentId(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      answerQue.map((checkIn) => new AnswerQueEntity(checkIn)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerQueDto: CreateAnswerQueDto,
  ) {
    const answer = await this.answerQuesService.update(id, updateAnswerQueDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new AnswerQueEntity(answer as any), // Use `as any` or ensure proper casting
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const answerQue = await this.answerQuesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new AnswerQueEntity(answerQue),
    );
  }
}
