import { Test, TestingModule } from '@nestjs/testing';
import { AnswerFriendsController } from './answer-friends.controller';
import { AnswerFriendsService } from './answer-friends.service';

describe('AnswerFriendsController', () => {
  let controller: AnswerFriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerFriendsController],
      providers: [AnswerFriendsService],
    }).compile();

    controller = module.get<AnswerFriendsController>(AnswerFriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
