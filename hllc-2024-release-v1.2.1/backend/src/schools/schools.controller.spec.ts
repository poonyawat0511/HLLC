import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

describe('SchoolController', () => {
  let controller: SchoolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolsController],
      providers: [SchoolsService],
    }).compile();

    controller = module.get<SchoolsController>(SchoolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
