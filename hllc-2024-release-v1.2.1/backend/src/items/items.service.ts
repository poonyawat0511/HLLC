import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { flattenObject } from 'src/app/common/utils/object.util';
import { Activity } from 'src/activities/schemas/activities.schema';
import { Evolution } from 'src/evolutions/schemas/evolution.schema';

@Injectable()
export class ItemsService {
  private readonly errorBuilder = new ErrorBuilder('Item');

  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(Evolution.name) private evolutionModel: Model<Evolution>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    try {
      const itemDoc = new this.itemModel(createItemDto);
      const item = await itemDoc.save();
      return item.toObject();
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

  async findAll(): Promise<Item[]> {
    const items = await this.itemModel.find().lean();
    return items;
  }

  async findOne(id: string): Promise<Item> {
    try {
      const item = await this.itemModel.findById(id).lean();
      if (!item) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    try {
      const exists = await this.itemModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const item = await this.itemModel
        .findByIdAndUpdate(
          id,
          { $set: flattenObject(updateItemDto) },
          { new: true },
        )
        .lean();
      return item;
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

  async remove(id: string): Promise<Item> {
    const item = await this.itemModel.findByIdAndDelete(id).lean().exec();
    if (!item) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return item;
  }

  async findUserItems(userId: string) {
    const activities = await this.activityModel.find({}, '_id').lean();
    const items = await this.itemModel
      .find({
        activity: { $in: activities.map((av) => av._id) },
      })
      .lean();
    const evolutions = await this.evolutionModel.find({ user: userId }).lean();
    const evolutionMap = new Map(
      evolutions.map((evolution) => [evolution.item.toString(), evolution]),
    );
    return items.map((item) => ({
      ...item,
      evolution: evolutionMap.get(item._id.toString()) ?? null,
    }));
  }
}
