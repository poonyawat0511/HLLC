import { Test, TestingModule } from '@nestjs/testing';
import { AnswerQuestionsService } from './answer-questions.service';

describe('AnswerQuestionsService', () => {
  let service: AnswerQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerQuestionsService],
    }).compile();

    service = module.get<AnswerQuestionsService>(AnswerQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
