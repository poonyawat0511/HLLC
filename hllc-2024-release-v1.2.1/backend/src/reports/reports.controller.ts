import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { ReportEntity } from './entities/report.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Report } from './schema/reports.schema';

@Controller('reports')
export class ReportsController {
  private readonly messageBuilder = new MessageBuilder('Report');

  constructor(private readonly reportsService: ReportsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Report)
  @Post()
  async createReport(@Body() createReportDto: CreateReportDto) {
    const report = await this.reportsService.create(createReportDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ReportEntity(report),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Report)
  @Get()
  async findAll() {
    const reports = await this.reportsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      reports.map((report) => new ReportEntity(report)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Report)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.reportsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ReportEntity(result),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Report)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const result = await this.reportsService.update(id, updateReportDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ReportEntity(result),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Report)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.reportsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ReportEntity(result),
    );
  }
}
