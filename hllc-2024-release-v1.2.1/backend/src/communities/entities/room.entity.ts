import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';

export class RoomEntity extends MongoEntity {
  name: { th: string; en: string };

  people: string;

  @TransformUrl({ type: 'string' })
  roomImage: string;

  saveHistory: boolean;

  constructor(partial: Partial<RoomEntity>) {
    super();
    Object.assign(this, partial);
  }
}
