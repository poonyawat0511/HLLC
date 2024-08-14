import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/rooms.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommunitiesService {
  private readonly errorBuilder = new ErrorBuilder('Rooms');

  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const roomDoc = new this.roomModel(createRoomDto);
      const room = await roomDoc.save();
      return room.toObject();
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

  async findAll(): Promise<Room[]> {
    const room = await this.roomModel.find().lean();
    return room;
  }

  async findOne(id: string): Promise<Room> {
    try {
      const room = await this.roomModel.findById(id).lean();
      if (!room) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      const exists = await this.roomModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const room = await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, options)
        .lean();
      return room;
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

  async remove(id: string): Promise<Room> {
    try {
      const room = await this.roomModel.findByIdAndDelete(id).lean();
      if (!room) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return room;
    } catch (error) {
      throw error;
    }
  }
}
