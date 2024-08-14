import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class StickerEntity extends MongoEntity {
  name: { th: string; en: string };

  @TransformUrl({ type: 'string' })
  sticker: string;

  constructor(partial: Partial<StickerEntity>) {
    super();
    Object.assign(this, partial);
  }
}
