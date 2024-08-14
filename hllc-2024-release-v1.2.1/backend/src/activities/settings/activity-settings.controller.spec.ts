import { Test, TestingModule } from '@nestjs/testing';
import { ActivitySettingsController } from './activity-settings.controller';
import { ActivitySettingsService } from './activity-settings.service';

describe('SettingsController', () => {
  let controller: ActivitySettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitySettingsController],
      providers: [ActivitySettingsService],
    }).compile();

    controller = module.get<ActivitySettingsController>(ActivitySettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
