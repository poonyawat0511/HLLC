import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AssessmentEntity } from './entities/assessment.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Assessment } from './schemas/assessments.schema';

@Controller('assessments')
export class AssessmentsController {
  private readonly messageBuilder = new MessageBuilder('Assessment');
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.create, Assessment)
  @Post()
  async create(@Body() createAssessmentDto: CreateAssessmentDto) {
    console.log(createAssessmentDto);
    const assessment =
      await this.assessmentsService.create(createAssessmentDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new AssessmentEntity(assessment),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, Assessment)
  @Get()
  async findAll() {
    const assessment = await this.assessmentsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      assessment.map((assessments) => new AssessmentEntity(assessments)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Assessment)
  @Get(':id/findOne')
  async findOne(@Param('id') id: string) {
    const assessment = await this.assessmentsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new AssessmentEntity(assessment),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/posttest')
  async findPosttest() {
    const assessment = await this.assessmentsService.findByStatusPosttest();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      assessment.map((assessments) => new AssessmentEntity(assessments)),
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/assessments')
  async findPretestPosttest() {
    const assessment = await this.assessmentsService.findByStatusPretestPosttest();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      assessment.map((assessments) => new AssessmentEntity(assessments)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Assessment)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<any> {
    const assessment = await this.assessmentsService.update(
      id,
      updateAssessmentDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new AssessmentEntity(assessment),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Assessment)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const assessment = await this.assessmentsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new AssessmentEntity(assessment),
    );
  }
}
