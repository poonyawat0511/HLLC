import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class RelationshipEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  sender?: Types.ObjectId | User | null;

  @TransformId((v) => new UserEntity(v))
  receiver?: Types.ObjectId | User | null;

  constructor(partial: Partial<RelationshipEntity>) {
    super();
    Object.assign(this, partial);
  }
}
