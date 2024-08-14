import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { ErrorBuilder, ErrorMethod, RequestAction } from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Gifts } from './schemas/gifts.schema';
import { Model } from 'mongoose';

@Injectable()
export class GiftsService {
  private readonly errorBuilder = new ErrorBuilder('Gifts');
  constructor(
    @InjectModel(Gifts.name) private readonly giftsModel: Model<Gifts>,
  ) {}

  async create(createGiftDto: CreateGiftDto) {
    try {
      const giftDoc = new this.giftsModel(createGiftDto);
      const gift = await giftDoc.save();
      const giftObj = gift.toObject();
      return giftObj;
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

  async findAll() :Promise<Gifts[]> {
    return await this.giftsModel.find().lean();
  }

  async findOne(id: string): Promise<Gifts> {
    const gift = await this.giftsModel.findById(id).lean();
    if (!gift) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return gift;
  }

  async update(id: string, updateGiftDto: UpdateGiftDto): Promise<Gifts> {
    const exists = await this.giftsModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return await this.giftsModel
      .findByIdAndUpdate(id, updateGiftDto, { new: true })
      .lean();
  }

  async remove(id: string): Promise<Gifts> {
    const gift = await this.giftsModel.findByIdAndDelete(id).lean();
    if (!gift) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return gift;
  }
  async findByUserId(userId: string): Promise<Gifts[]> {
    return await this.giftsModel
      .find({ sendergift: userId })
      .populate('receivergift')
      .populate('sendergift')
      .lean();
  }
}
