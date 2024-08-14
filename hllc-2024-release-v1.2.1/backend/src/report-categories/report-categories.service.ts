import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportCategoryDto } from './dto/create-report-category.dto';
import { UpdateReportCategoryDto } from './dto/update-report-category.dto';
import { ReportCategory } from './schemas/report-category.schema';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';

@Injectable()
export class ReportCategoriesService {
  private readonly errorBuilder = new ErrorBuilder(
    'Report category',
    'Report categories',
  );

  constructor(
    @InjectModel(ReportCategory.name)
    private reportCategoryModel: Model<ReportCategory>,
  ) {}

  async create(
    createReportsCategoryDto: CreateReportCategoryDto,
  ): Promise<ReportCategory> {
    try {
      const reportsCategoryDoc = new this.reportCategoryModel(
        createReportsCategoryDto,
      );
      const reportsCategory = await reportsCategoryDoc.save();
      return reportsCategory.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<ReportCategory[]> {
    const reportCategories = await this.reportCategoryModel.find().lean();
    return reportCategories;
  }

  async findOne(id: string): Promise<ReportCategory> {
    try {
      const reportCategory = await this.reportCategoryModel.findById(id).lean();
      if (!reportCategory) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return reportCategory;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateReportsCategoryDto: UpdateReportCategoryDto,
  ): Promise<ReportCategory> {
    try {
      const exists = await this.reportCategoryModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      const options = { new: true };
      const reportCategory = await this.reportCategoryModel
        .findByIdAndUpdate(id, updateReportsCategoryDto, options)
        .lean();

      return reportCategory;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }

      throw error;
    }
  }

  async remove(id: string): Promise<ReportCategory> {
    try {
      const reportCategory = await this.reportCategoryModel
        .findByIdAndDelete(id)
        .lean();
      if (!reportCategory) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return reportCategory;
    } catch (error) {
      throw error;
    }
  }
}
