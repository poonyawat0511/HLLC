import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { School } from 'src/schools/schemas/school.schema';
import { SchoolEntity } from 'src/schools/entities/school.entity';
import { TransformId } from 'src/app/decorator/transform-id.decorator';

export class MajorEntity extends MongoEntity {
  constructor(partial: Partial<MajorEntity>) {
    super();
    Object.assign(this, partial);
  }

  acronym: string;
  
  @TransformId((value) => new SchoolEntity(value))
  school?: Types.ObjectId | School | string | null;
}
