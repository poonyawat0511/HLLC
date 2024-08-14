import { Test, TestingModule } from '@nestjs/testing';
import { ActivitySettingsService } from './activity-settings.service';

describe('SettingsService', () => {
  let service: ActivitySettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitySettingsService],
    }).compile();

    service = module.get<ActivitySettingsService>(ActivitySettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
