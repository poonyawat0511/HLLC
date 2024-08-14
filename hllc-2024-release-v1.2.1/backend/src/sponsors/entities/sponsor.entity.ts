import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { SponsorType } from '../interfaces/sponsors.interface';

export class SponsorEntity extends MongoEntity {
  name: { th: string; en: string };

  @TransformUrl({ type: 'string' })
  logo: string;

  show: boolean;

  type: SponsorType;

  no: number;

  constructor(partial: Partial<SponsorEntity>) {
    super();
    Object.assign(this, partial);
  }
}
