import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Sticker } from './schemas/stickers.schema';
import { Model } from 'mongoose';

@Injectable()
export class StickersService {
  private readonly errorBuilder = new ErrorBuilder('Stickers');

  constructor(
    @InjectModel(Sticker.name)
    private stickerModel: Model<Sticker>,
  ) {}

  async create(createStickerDto: CreateStickerDto): Promise<Sticker> {
    try {
      const stickerDoc = new this.stickerModel(createStickerDto);
      const sticker = await stickerDoc.save();
      return sticker.toObject();
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

  async findAll(): Promise<Sticker[]> {
    const sticker = await this.stickerModel.find().lean().exec();
    return sticker;
  }

  async findOne(id: string): Promise<Sticker> {
    try {
      const sticker = await this.stickerModel.findById(id).lean();
      if (!sticker) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return sticker;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateStickerDto: UpdateStickerDto) {
    try {
      const exists = await this.stickerModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const sticker = await this.stickerModel
        .findByIdAndUpdate(id, updateStickerDto, options)
        .lean();
      return sticker;
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
      const sticker = await this.stickerModel.findByIdAndDelete(id).lean();
      if (!sticker) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return sticker;
    } catch (error) {
      throw error;
    }
  }
}
