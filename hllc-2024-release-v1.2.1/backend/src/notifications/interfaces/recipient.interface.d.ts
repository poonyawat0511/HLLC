import { Types } from 'mongoose';
import { RecipientType } from '../enums/notificaton-target.enum';

export interface Recipient {
  type: RecipientType;

  id: string | Types.ObjectId;
}
