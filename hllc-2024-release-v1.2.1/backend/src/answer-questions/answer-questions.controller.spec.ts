import { Test, TestingModule } from '@nestjs/testing';
import { AnswerQuestionsController } from './answer-questions.controller';
import { AnswerQuestionsService } from './answer-questions.service';

describe('AnswerQuestionsController', () => {
  let controller: AnswerQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerQuestionsController],
      providers: [AnswerQuestionsService],
    }).compile();

    controller = module.get<AnswerQuestionsController>(AnswerQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
