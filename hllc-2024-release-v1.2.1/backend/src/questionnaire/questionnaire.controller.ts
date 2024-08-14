import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { Actions, UseAbility } from 'nest-casl';
import { Questionnaire } from './schemas/questionnaire.schema';
import { QuestionnaireEntity } from './entities/questionnaire.entity';

@Controller('questionnaire')
export class QuestionnaireController {
  private readonly messageBuilder = new MessageBuilder(
    'Questionnaire',
    'Questionnaires',
  );
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createQuestion(
    @Body() CreateQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<any> {
    const question = await this.questionnaireService.create(
      CreateQuestionnaireDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new QuestionnaireEntity(question),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const question = await this.questionnaireService.findAll();
    const questionEntities = question.map(
      (question) => new QuestionnaireEntity(question),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      questionEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const question = await this.questionnaireService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new QuestionnaireEntity(question),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateQuestionnaireDto: UpdateQuestionnaireDto,
  ): Promise<any> {
    const question = await this.questionnaireService.update(
      id,
      UpdateQuestionnaireDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new QuestionnaireEntity(question),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseAbility(Actions.delete, Questionnaire)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const question = await this.questionnaireService.remove(id);
    return createResponse(
      HttpStatus.OK,

      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new QuestionnaireEntity(question),
    );
  }
}
