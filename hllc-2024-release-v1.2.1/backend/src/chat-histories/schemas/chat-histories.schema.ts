import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Room } from 'src/communities/schemas/rooms.schema';
export type ChatHistoriesDocument = HydratedDocument<ChatHistories>;

@Schema()
export class ChatHistories {
  @Prop({ type: String, required: true })
  room: string;

  @Prop([
    {
      user: { type: SchemaTypes.ObjectId, ref: 'user', required: true },
      text: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now },
    },
  ])
  histories: Array<{
    user: User | Types.ObjectId;
    text?: string;
    timestamp?: Date;
  }>;
}

export const ChatHistoriesSchema = SchemaFactory.createForClass(ChatHistories);
ChatHistoriesSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
ChatHistoriesSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
