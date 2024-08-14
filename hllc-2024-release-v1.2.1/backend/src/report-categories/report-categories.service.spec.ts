import { Test, TestingModule } from '@nestjs/testing';
import { ReportCategoriesService } from './report-categories.service';

describe('ReportsCategoryService', () => {
  let service: ReportCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCategoriesService],
    }).compile();

    service = module.get<ReportCategoriesService>(ReportCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
