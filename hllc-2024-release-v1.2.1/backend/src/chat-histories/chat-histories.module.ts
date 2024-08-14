import { forwardRef, Module } from '@nestjs/common';
import { ChatHistoriesService } from './chat-histories.service';
import { ChatHistoriesController } from './chat-histories.controller';
import {
  ChatHistories,
  ChatHistoriesSchema,
} from './schemas/chat-histories.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunitiesModule } from 'src/communities/communities.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatHistories.name, schema: ChatHistoriesSchema },
    ]),
    forwardRef(() => CommunitiesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ChatHistoriesController],
  providers: [ChatHistoriesService],
  exports: [
    MongooseModule.forFeature([
      { name: ChatHistories.name, schema: ChatHistoriesSchema },
    ]),
    ChatHistoriesService,
  ],
})
export class ChatHistoriesModule {}
