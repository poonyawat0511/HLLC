import { Module } from '@nestjs/common';
import { ReportCategoriesService } from './report-categories.service';
import { ReportCategoriesController } from './report-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReportCategory,
  CategorySchema,
} from './schemas/report-category.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './reprot-categories.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportCategory.name, schema: CategorySchema },
    ]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [ReportCategoriesController],
  providers: [ReportCategoriesService],
  exports: [
    MongooseModule.forFeature([
      { name: ReportCategory.name, schema: CategorySchema },
    ]),
    ReportCategoriesService,
  ],
})
export class ReportsCategoryModule {}
