import { Types } from 'mongoose';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class ItemEntity extends MongoEntity {
  name: { th: string; en: string };

  description: { th: string; en: string };

  @TransformUrl({ type: 'string' })
  image: string;

  @TransformId((v) => new ActivityEntity(v))
  activity?: string | Types.ObjectId | Activity | null;

  constructor(partail: Partial<ItemEntity>) {
    super();
    Object.assign(this, partail);
  }
}
