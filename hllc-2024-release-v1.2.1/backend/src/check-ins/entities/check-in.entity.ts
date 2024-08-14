import { Types } from 'mongoose';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { Admin } from 'src/admins/schemas/admin.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class CheckInEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  user?: Types.ObjectId | User | string | null;

  @TransformId((v) => new AdminEntity(v))
  staff?: Types.ObjectId | Admin | string | null;

  @TransformId((v) => new ActivityEntity(v))
  activity?: Types.ObjectId | Activity | string | null;

  timestamp: Date;

  constructor(partial: Partial<CheckInEntity>) {
    super();
    Object.assign(this, partial);
  }
}
