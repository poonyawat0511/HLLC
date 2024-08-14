import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './schema/reports.schema';
import { ErrorBuilder, ErrorMethod } from 'src/app/common/utils/error.util';

const POPULATE_PIPE = [
  { path: 'category' },
  {
    path: 'reporter',
    select: ['name', 'username', 'major'],
    populate: { path: 'major', populate: { path: 'school' } },
  },
];

@Injectable()
export class ReportsService {
  private readonly errorBuilder = new ErrorBuilder('Report');

  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const createdReport = new this.reportModel(createReportDto);
    const report = await createdReport.save();
    await createdReport.populate(POPULATE_PIPE);
    return report.toObject();
  }

  async findAll(): Promise<Report[]> {
    const reports = await this.reportModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();

    return reports;
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel
      .findById(id)
      .populate(POPULATE_PIPE)
      .lean();
    if (!report) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.reportModel
      .findByIdAndUpdate(id, updateReportDto, { new: true })
      .populate(POPULATE_PIPE)
      .lean();
    if (!report) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return report;
  }

  async remove(id: string): Promise<Report> {
    const result = await this.reportModel.findByIdAndDelete(id).lean();
    if (!result) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return result;
  }
}
