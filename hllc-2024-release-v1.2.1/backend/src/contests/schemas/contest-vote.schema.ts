import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Contest } from 'src/contests/schemas/contest.schema';
import { User } from 'src/users/schemas/user.schema';

export type VoteDocument = HydratedDocument<ContestVote>;

@Schema({ timestamps: true })
export class ContestVote {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  author: User | Types.ObjectId | string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Contest', default: null })
  current: Contest | Types.ObjectId | null;

  @Prop([
    {
      content: { type: SchemaTypes.ObjectId, ref: 'Contest', required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ])
  histories: Array<{
    content: Contest | Types.ObjectId;
    timestamp?: Date;
  }>;
}

export const ContestVoteSchema = SchemaFactory.createForClass(ContestVote);

ContestVoteSchema.set('toJSON', { versionKey: false });
ContestVoteSchema.set('toObject', { versionKey: false });
