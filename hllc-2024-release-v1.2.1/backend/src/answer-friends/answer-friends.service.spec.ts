import { Test, TestingModule } from '@nestjs/testing';
import { AnswerFriendsService } from './answer-friends.service';

describe('AnswerFriendsService', () => {
  let service: AnswerFriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerFriendsService],
    }).compile();

    service = module.get<AnswerFriendsService>(AnswerFriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
