import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePretestDto } from './dto/create-pretest.dto';
import { UpdatePretestDto } from './dto/update-pretest.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Pretest } from './schemas/pretest.schema';
import { Model } from 'mongoose';

const POPULATE_PIPE = [
  {
    path: 'author',
    select: ['username'],
  },
  {
    path: 'values.assessment',
    select: ['assessment', 'value'],
  },
];
@Injectable()
export class PretestService {
  private readonly errorBuilder = new ErrorBuilder('Answer', 'Answers');

  constructor(
    @InjectModel(Pretest.name)
    private pretestModel: Model<Pretest>,
  ) {}

  async create(createPretestDto: CreatePretestDto): Promise<Pretest> {
    try {
      const pretestDoc = new this.pretestModel(createPretestDto);
      const pretest = await pretestDoc.save();
      return pretest.toObject();
    } catch (error) {
      if (error.code === 11000) {
        console.error('Duplicate key error:', error.message);
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Pretest[]> {
    const pretests = await this.pretestModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return pretests;
  }

  async findOne(id: string): Promise<Pretest> {
    try {
      const pretest = await this.pretestModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!pretest) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return pretest;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePretestDto: UpdatePretestDto) {
    try {
      const exists = await this.pretestModel.exists({ _id: id });

      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      const pretest = await this.pretestModel
        .findByIdAndUpdate(id, updatePretestDto, { new: true })
        .lean();

      return pretest;
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

  async remove(id: string): Promise<Pretest> {
    const pretest = await this.pretestModel.findByIdAndDelete(id).lean();
    if (!pretest) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return pretest;
  }
}
