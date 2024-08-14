import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentSectionsController } from './assessment-sections.controller';
import { AssessmentSectionsService } from './assessment-sections.service';

describe('AssessmentSectionsController', () => {
  let controller: AssessmentSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentSectionsController],
      providers: [AssessmentSectionsService],
    }).compile();

    controller = module.get<AssessmentSectionsController>(
      AssessmentSectionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
