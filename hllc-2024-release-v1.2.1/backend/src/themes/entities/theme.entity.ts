import { Transform } from 'class-transformer';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { Types } from 'mongoose';
import { School } from 'src/schools/schemas/school.schema';
import { SchoolEntity } from 'src/schools/entities/school.entity';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class ThemeEntity extends MongoEntity {
  @TransformId((value) => new SchoolEntity(value))
  school?: Types.ObjectId | School | null;

  @Transform(({ value }) => value ?? {})
  colors: Record<string, string>;

  @TransformUrl({ type: 'object', paths: 'all' })
  assets: Record<string, string>;

  constructor(partial: Partial<ThemeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
