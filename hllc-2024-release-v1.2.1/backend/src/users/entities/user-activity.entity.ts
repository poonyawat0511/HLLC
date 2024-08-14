import { ActivityEntity } from '../../activities/entities/activity.entity';
import { ActivityProgress } from '../../activities/interfaces/activity.interface';

export class UserActivityEntity extends ActivityEntity {
  status: ActivityProgress;

  checkInAt: Date;

  constructor(partail: Partial<UserActivityEntity>) {
    super(partail);
  }
}
