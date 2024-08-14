import { Types } from 'mongoose';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { MajorEntity } from 'src/majors/entities/major.entity';
import { Major } from 'src/majors/schemas/major.schema';

export class ActivitySettingEntity extends MongoEntity {
  @TransformId((value) => new ActivityEntity(value))
  activity?: Types.ObjectId | Activity | string | null;

  @TransformId((value) => new MajorEntity(value))
  major?: Types.ObjectId | Major | string | null;

  constructor(partial: Partial<ActivitySettingEntity>) {
    super();
    Object.assign(this, partial);
  }
}
