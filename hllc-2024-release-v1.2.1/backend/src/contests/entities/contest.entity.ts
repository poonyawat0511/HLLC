import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

class MemberEntity extends MongoEntity {
  name: string;

  studentId: string;

  constructor(partail: Partial<MemberEntity>) {
    super();
    Object.assign(this, partail);
  }
}

export class ContestEntity extends MongoEntity {
  team: string;

  category: { th: string; en: string };

  title: { th: string; en: string };

  description: { th: string; en: string };

  @TransformId((v) => new MemberEntity(v))
  members: { name: string; studentId: string; id: string }[];

  @TransformUrl({ type: 'string' })
  coverImage: string;

  url: string;

  constructor(partial: Partial<ContestEntity>) {
    super();
    Object.assign(this, partial);
  }
}
