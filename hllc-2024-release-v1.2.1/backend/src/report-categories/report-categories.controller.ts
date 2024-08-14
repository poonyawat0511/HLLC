import {
  Controller,
  ClassSerializerInterceptor,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReportCategoriesService } from './report-categories.service';
import { CreateReportCategoryDto } from './dto/create-report-category.dto';
import { UpdateReportCategoryDto } from './dto/update-report-category.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { ReportCategoryEntity } from './entities/report-category.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ReportCategory } from './schemas/report-category.schema';

@Controller('report-categories')
export class ReportCategoriesController {
  private readonly messageBuilder = new MessageBuilder(
    'Report category',
    'Report categories',
  );

  constructor(
    private readonly reportCategoriesService: ReportCategoriesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, ReportCategory)
  @Post()
  async createCategoryReport(
    @Body() createReportsCategoryDto: CreateReportCategoryDto,
  ) {
    const reportsCategory = await this.reportCategoriesService.create(
      createReportsCategoryDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ReportCategoryEntity(reportsCategory),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ReportCategory)
  @Get()
  async findAll() {
    const reportCategories = await this.reportCategoriesService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      reportCategories.map((category) => new ReportCategoryEntity(category)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ReportCategory)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reportCategory = await this.reportCategoriesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ReportCategoryEntity(reportCategory),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, ReportCategory)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportsCategoryDto: UpdateReportCategoryDto,
  ) {
    const reportCategory = await this.reportCategoriesService.update(
      id,
      updateReportsCategoryDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ReportCategoryEntity(reportCategory),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, ReportCategory)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const reportCategory = await this.reportCategoriesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ReportCategoryEntity(reportCategory),
    );
  }
}
