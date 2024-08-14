import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { ActivityType } from '../enums/activity-type.enum';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class ActivityEntity extends MongoEntity {
  name: { th: string; en: string };

  shortName: { th: string; en: string };

  code: string;

  type: ActivityType;

  description: { th: string; en: string };

  shortDesc: { th: string; en: string };

  open: boolean;

  progress: boolean;

  show: boolean;

  @TransformUrl({ type: 'string' })
  icon: string;

  @TransformUrl({ type: 'string' })
  banner: string;

  constructor(partail: Partial<ActivityEntity>) {
    super();
    Object.assign(this, partail);
  }
}
