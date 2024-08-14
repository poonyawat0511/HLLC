import { Test, TestingModule } from '@nestjs/testing';
import { ReportCategoriesController } from './report-categories.controller';
import { ReportCategoriesService } from './report-categories.service';

describe('ReportsTopicController', () => {
  let controller: ReportCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportCategoriesController],
      providers: [ReportCategoriesService],
    }).compile();

    controller = module.get<ReportCategoriesController>(
      ReportCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
