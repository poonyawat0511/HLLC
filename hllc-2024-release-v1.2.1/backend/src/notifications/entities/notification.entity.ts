import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
import { Recipient } from '../interfaces/recipient.interface';
import { TransformRecipients } from 'src/app/decorator/transform-recipients.decorator';

export class NotificationEntity extends MongoEntity {
  constructor(partial: Partial<NotificationEntity>) {
    super();
    Object.assign(this, partial);
  }

  _id: string | Types.ObjectId;

  @TransformUrl({ type: 'string' })
  image: string;

  @TransformRecipients()
  recipients: 'everyone' | Recipient[];
}
