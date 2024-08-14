import { Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { ItemEntity } from 'src/items/entities/item.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class EvolutionEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  user?: string | Types.ObjectId | Activity | null;

  @TransformId((v) => new ItemEntity(v))
  item?: string | Types.ObjectId | Activity | null;

  constructor(partail: Partial<EvolutionEntity>) {
    super();
    Object.assign(this, partail);
  }
}
