import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Sponsor } from 'src/sponsors/schemas/sponsors.schema';
import { SponsorEntity } from 'src/sponsors/entities/sponsor.entity';

class ConditionEntity extends MongoEntity {
  th: string;
  en: string;
  constructor(partail: Partial<ConditionEntity>) {
    super();
    Object.assign(this, partail);
  }
}
export class VoucherEntity extends MongoEntity {
  discount: { th: string; en: string };

  @TransformId((value) => new ConditionEntity(value))
  condition: { th: string; en: string; id: string }[];

  @TransformUrl({
    type: 'object',
    paths: ['main', 'front', 'back'],
  })
  voucherImages: {
    main: string;
    front: string;
    back: string;
  };

  @TransformId((value) => new SponsorEntity(value))
  sponsor?: Types.ObjectId | Sponsor | null;

  exp: Date;

  acronym: string;

  constructor(partial: Partial<VoucherEntity>) {
    super();
    Object.assign(this, partial);
  }
}
