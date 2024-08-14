import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { UserEntity } from "src/users/entities/user.entity";
import { User } from "src/users/schemas/user.schema";

export class GiftsEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  sendergift?: Types.ObjectId | User | string | null;

  @TransformId((v) => new UserEntity(v))
  receivergift?: Types.ObjectId | User | string | null;

  point: number;

  isSended: boolean;

  constructor(partial: Partial<GiftsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
