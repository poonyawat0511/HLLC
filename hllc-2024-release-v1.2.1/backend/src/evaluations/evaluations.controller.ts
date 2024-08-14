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
  UseGuards,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { EvaluationEntity } from './entities/evaluation.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Evaluation } from './schemas/evaluation.schema';

@Controller('evaluations')
export class EvaluationsController {
  private readonly messageBuilder = new MessageBuilder(
    'activity-answer',
    'activity-answers',
  );
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Evaluation)
  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    const evaluation =
      await this.evaluationsService.create(createEvaluationDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new EvaluationEntity(evaluation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Evaluation)
  @Get()
  async findAll() {
    const evaluations = await this.evaluationsService.findAll();
    const EvaluationEntities = evaluations.map(
      (evaluation) => new EvaluationEntity(evaluation),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      EvaluationEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Evaluation)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const evaluation = await this.evaluationsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new EvaluationEntity(evaluation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Evaluation)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    const evaluation = await this.evaluationsService.update(
      id,
      updateEvaluationDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new EvaluationEntity(evaluation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Evaluation)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const evaluation = await this.evaluationsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new EvaluationEntity(evaluation),
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search/:userId')
  async findByUserId(@Param('userId') id: string) {
    const checkIns = await this.evaluationsService.findByUserId(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      checkIns.map((checkIn) => new EvaluationEntity(checkIn)),
    );
  }
}
