import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { AnswerQuestionsService } from './answer-questions.service';
import { CreateAnswerQuestionDto } from './dto/create-answer-question.dto';
import { UpdateAnswerQuestionDto } from './dto/update-answer-question.dto';
import { AnswerQuestionEntity } from './entities/answer-question.entity';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';

@Controller('answer-questions')
export class AnswerQuestionsController {
  private readonly messageBuilder = new MessageBuilder('Answer Question');
  constructor(
    private readonly answerQuestionsService: AnswerQuestionsService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createAnswerQuestionDto: CreateAnswerQuestionDto) {
    const answerQuestion = await this.answerQuestionsService.create(
      createAnswerQuestionDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new AnswerQuestionEntity(answerQuestion),
    );
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    const answerQuestions = await this.answerQuestionsService.findAll();
    const answerQuestionEntities = answerQuestions.map(
      (pretest) => new AnswerQuestionEntity(pretest),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      answerQuestionEntities,
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string) {
    const answerQuestion = await this.answerQuestionsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new AnswerQuestionEntity(answerQuestion),
    );
  }

  @Get(':questionId/user')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAnswer(
    @Param('questionId') questionId: string,
    @Req() req: Request,
  ) {
    const answerQuestions =
      await this.answerQuestionsService.findAnswerByQuestionAndUser(
        req['user'].id,
        questionId,
      );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      answerQuestions.map((v) => new AnswerQuestionEntity(v)),
    );
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateAnswerQuestionDto: UpdateAnswerQuestionDto,
  ) {
    const answerQuestion = await this.answerQuestionsService.update(
      id,
      updateAnswerQuestionDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new AnswerQuestionEntity(answerQuestion),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const answerQuestion = await this.answerQuestionsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new AnswerQuestionEntity(answerQuestion),
    );
  }
}
