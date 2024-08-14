import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { ChatHistories } from '../schemas/chat-histories.schema';
import { RoomEntity } from 'src/communities/entities/room.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';
import { Room } from 'src/communities/schemas/rooms.schema';

class HistoryEntity {
  @TransformId((v) => new UserEntity(v))
  user: string | User | null;

  text: string;

  timestamp: Date;

  constructor(partial: Partial<HistoryEntity>) {
    Object.assign(this, partial);
  }
}
export class ChatHistoryEntity extends MongoEntity {
  room: string;

  @TransformId((v) => new HistoryEntity(v))
  histories: ChatHistories['histories'];

  constructor(partial: Partial<ChatHistoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
