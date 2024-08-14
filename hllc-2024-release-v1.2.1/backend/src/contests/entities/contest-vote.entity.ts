import { Contest } from 'src/contests/schemas/contest.schema';
import { User } from 'src/users/schemas/user.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { ContestVote } from '../schemas/contest-vote.schema';
import { UserEntity } from 'src/users/entities/user.entity';
import { ContestEntity } from 'src/contests/entities/contest.entity';
import { Types } from 'mongoose';

class VoteHistoryEntity {
  @TransformId((v) => new ContestEntity(v))
  content?: string | Contest | null;

  timestamp: Date;

  constructor(partial: Partial<VoteHistoryEntity>) {
    Object.assign(this, partial);
  }
}

export class ContestVoteEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  author?: Types.ObjectId | User | null | string;

  @TransformId((v) => new ContestEntity(v))
  current?: Types.ObjectId | Contest | null | string;

  @TransformId((v) => new VoteHistoryEntity(v))
  histories: ContestVote['histories'];

  constructor(partial: Partial<ContestVoteEntity>) {
    super();
    Object.assign(this, partial);
  }
}
