import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatHistories } from './schemas/chat-histories.schema';
import { Model, Types } from 'mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { Room } from 'src/communities/schemas/rooms.schema';

@Injectable()
export class ChatHistoriesService {
  private readonly errorBuilder = new ErrorBuilder('ChatHistories');
  constructor(
    @InjectModel(ChatHistories.name)
    private chathistoriesmodel: Model<ChatHistories>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {}

  async addMessage(roomName: string, userId: string, text: string) {
    try {
      // Find the room by name.en instead of just name
      const room = await this.roomModel.findOne({ 'name.en': roomName }).exec();
      if (!room) {
        throw new NotFoundException(`Room with name ${roomName} not found`);
      }

      // Now we have the room's _id (roomId)
      const roomId = room._id;

      if (!room.saveHistory) {
        console.log(`Room ${roomName} is set not to save history`);
        return;
      }

      await this.chathistoriesmodel
        .findOneAndUpdate(
          { room: roomId }, // Use roomId here
          {
            $push: { histories: { user: userId, text, timestamp: new Date() } },
          },
          { new: true, upsert: true },
        )
        .exec();
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getMessagesByRoom(roomId: string): Promise<ChatHistories> {
    return this.chathistoriesmodel.findOne({ room: roomId }).exec(); // Use roomId as a string
  }

  async create(
    createChatHistoryDto: CreateChatHistoryDto,
  ): Promise<ChatHistories> {
    try {
      const chathistoriesDoc = new this.chathistoriesmodel(
        createChatHistoryDto,
      );
      const chathistories = await chathistoriesDoc.save();
      return chathistories.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll() {
    const chathistories = await this.chathistoriesmodel.find().lean();
    return chathistories;
  }

  async findOne(id: string) {
    try {
      const chathistories = await this.chathistoriesmodel.findById(id).lean();
      if (!chathistories) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return chathistories;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateChatHistoryDto: UpdateChatHistoryDto) {
    try {
      const exists = await this.chathistoriesmodel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const chathistories = await this.chathistoriesmodel
        .findByIdAndUpdate(id, updateChatHistoryDto, options)
        .lean();
      return chathistories;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      const chathistories = await this.chathistoriesmodel
        .findByIdAndDelete(id)
        .lean();
      if (!chathistories) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return chathistories;
    } catch (error) {
      throw error;
    }
  }
}
