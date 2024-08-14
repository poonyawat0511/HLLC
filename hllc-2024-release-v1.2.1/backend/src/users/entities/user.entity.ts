import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { MajorEntity } from 'src/majors/entities/major.entity';
import { Major } from 'src/majors/schemas/major.schema';

export class UserEntity extends MongoEntity {
  name?: {
    first: string;
    last: string;
  };

  @Exclude()
  password: string;

  @Exclude()
  secret: string;

  @TransformId((value) => new MajorEntity(value))
  major?: Types.ObjectId | Major | null;

  @Expose()
  get fullName(): string {
    if (!this.name) return undefined;
    return `${this.name.first} ${this.name.last}`;
  }

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
