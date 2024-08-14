import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class LamduanEntity extends MongoEntity {
  @TransformId((value) => new UserEntity(value))
  user?: Types.ObjectId | User | null;

  text: string;

  @TransformUrl({ type: 'string' })
  lamduanImage: string;

  constructor(partial: Partial<LamduanEntity>) {
    super();
    Object.assign(this, partial);
  }
}
