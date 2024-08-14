import { Test, TestingModule } from '@nestjs/testing';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';

describe('RelationshipController', () => {
  let controller: RelationshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationshipController],
      providers: [RelationshipService],
    }).compile();

    controller = module.get<RelationshipController>(RelationshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
