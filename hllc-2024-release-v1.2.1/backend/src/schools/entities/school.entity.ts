import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { MajorEntity } from 'src/majors/entities/major.entity';
import { Major } from 'src/majors/schemas/major.schema';

export class SchoolEntity extends MongoEntity {
  constructor(partial: Partial<SchoolEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformId((v) => new MajorEntity(v))
  majors?: Major[];

  acronym: string;

  @TransformUrl({
    type: 'object',
    paths: ['first', 'second', 'third', 'fourth'],
  })
  photos: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
}
