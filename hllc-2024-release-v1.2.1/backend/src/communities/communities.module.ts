import { forwardRef, Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { CommunitiesGateway } from './communities.gateway';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/rooms.schema';
import { StickersModule } from 'src/stickers/stickers.module';
import { AccessTokenModule } from 'src/auth/access-token/access-token.module';
import { ChatHistoriesModule } from 'src/chat-histories/chat-histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => StickersModule),
    forwardRef(() => ChatHistoriesModule),
    AccessTokenModule,
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesGateway],
  exports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    CommunitiesService,
  ],
})
export class CommunitiesModule {}
