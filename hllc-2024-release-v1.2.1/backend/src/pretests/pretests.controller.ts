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
import { PretestService } from './pretests.service';
import { CreatePretestDto } from './dto/create-pretest.dto';
import { UpdatePretestDto } from './dto/update-pretest.dto';
import { PretestEntity } from './entities/pretest.entity';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AssessmentsService } from '../assessments/assessments.service';
import { AssessmentEntity } from '../assessments/entities/assessment.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Pretest } from './schemas/pretest.schema';

@Controller('pretests')
export class PretestController {
  private readonly messageBuilder = new MessageBuilder('Answer Assessment');
  constructor(
    private readonly pretestService: PretestService,
    private readonly assessmentsService: AssessmentsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Pretest)
  @Post()
  async create(@Body() createPretestDto: CreatePretestDto) {
    const pretest = await this.pretestService.create(createPretestDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new PretestEntity(pretest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Pretest)
  @Get()
  async findAll() {
    const pretests = await this.pretestService.findAll();
    const pretestEntities = pretests.map(
      (pretest) => new PretestEntity(pretest),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      pretestEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Pretest)
  @Get(':id/findone')
  async findOne(@Param('id') id: string) {
    const pretest = await this.pretestService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new PretestEntity(pretest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Pretest)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePretestDto: UpdatePretestDto,
  ) {
    const pretest = await this.pretestService.update(id, updatePretestDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new PretestEntity(pretest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Pretest)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pretest = await this.pretestService.remove(id);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new PretestEntity(pretest),
    );
  }
}
