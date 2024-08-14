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
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionEntity } from './entities/question.entity';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Question } from './schemas/question.schema';

const UPLOAD_FIELDS = [{ name: 'image', maxCount: 1 }];

const imageUploadInterCepters = FileFieldsInterceptor(UPLOAD_FIELDS, {
  storage: storageConfig,
});

type UploadedImage = { image?: Express.Multer.File[] };

@Controller('questions')
export class QuestionsController {
  private readonly messageBuilder = new MessageBuilder('Question');
  constructor(private readonly questionsService: QuestionsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.create, Question)
  @Post()
  @UseInterceptors(imageUploadInterCepters)
  async createCreateQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<ResponseDto<any>> {
    const image = files?.image?.[0].filename;
    const question = await this.questionsService.create({
      ...createQuestionDto,
      image,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new QuestionEntity(question),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, Question)
  @Get()
  async findAll() {
    const question = await this.questionsService.findAll();
    const questionEntities = question.map(
      (question) => new QuestionEntity(question),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      questionEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, Question)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const question = await this.questionsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new QuestionEntity(question),
    );
  }

  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.update, Question)
  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(imageUploadInterCepters)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<any> {
    let image = null
    if (files?.image) {
      image = files?.image?.[0].filename;
    } else {
      const question = await this.questionsService.findOne(id);
      image = question.image;
    }
    const dtoWithPhoto = { ...updateQuestionDto, image };
    const question = await this.questionsService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new QuestionEntity(question),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.delete, Question)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const question = await this.questionsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new QuestionEntity(question),
    );
  }
}
