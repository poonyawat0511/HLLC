import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProgressEntity extends UserEntity {
  @TransformId((item) => new ActivityEntity(item))
  activities: Activity;
}
