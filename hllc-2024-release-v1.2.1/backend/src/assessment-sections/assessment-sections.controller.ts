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
import { AssessmentSectionsService } from './assessment-sections.service';
import { CreateAssessmentSectionDto } from './dto/create-assessment-section.dto';
import { UpdateAssessmentSectionDto } from './dto/update-assessment-section.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AssessmentSectionEntity } from './entities/assessment-section.entity';
import { AssessmentsService } from 'src/assessments/assessments.service';
import { AssessmentEntity } from 'src/assessments/entities/assessment.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { AssessmentSection } from './schemas/assessment-section.schema';

@Controller('assessment-sections')
export class AssessmentSectionsController {
  private readonly messageBuilder = new MessageBuilder('AssessmentSection');

  constructor(
    private readonly assessmentSectionsService: AssessmentSectionsService,
    private readonly assessmentService: AssessmentsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createAssessmentSectionDto: CreateAssessmentSectionDto) {
    const assessmentSection = await this.assessmentSectionsService.create(
      createAssessmentSectionDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new AssessmentSectionEntity(assessmentSection),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const sections = await this.assessmentSectionsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      sections.map((section) => new AssessmentSectionEntity(section)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, AssessmentSection)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const assessmentSection = await this.assessmentSectionsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new AssessmentSectionEntity(assessmentSection),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, AssessmentSection)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentSectionDto: UpdateAssessmentSectionDto,
  ) {
    const assessmentSection = await this.assessmentSectionsService.update(
      id,
      updateAssessmentSectionDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new AssessmentSectionEntity(assessmentSection),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, AssessmentSection)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const assessmentSection = await this.assessmentSectionsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new AssessmentSectionEntity(assessmentSection),
    );
  }
}
