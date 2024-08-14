import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentSectionsService } from './assessment-sections.service';

describe('AssessmentSectionsService', () => {
  let service: AssessmentSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentSectionsService],
    }).compile();

    service = module.get<AssessmentSectionsService>(AssessmentSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
