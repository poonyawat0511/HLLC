import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { Major, MajorDocument } from './schemas/major.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import School from 'src/schools/interfaces/school.interface';
import { extractQury } from 'src/app/common/utils/query.util';

type FindSchoolOptions = {
  includes: string | string[];
};

type MajorWithSchool = Major & { school?: School | null };

type QueryResults = Major | MajorWithSchool;

@Injectable()
export class MajorsService {
  private readonly errorBuilder = new ErrorBuilder('Major');
  constructor(
    @InjectModel(Major.name)
    private readonly majorModel: Model<MajorDocument>,
  ) {}

  async create(
    createMajorDto: CreateMajorDto,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    try {
      const majorDoc = new this.majorModel(createMajorDto);
      const major = await majorDoc.save();

      if (options.includes) {
        const query = extractQury(options.includes);
        if (query.school) {
          await major.populate('school');
        }
      }

      return major.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
    }
  }

  async findAll(options?: FindSchoolOptions): Promise<QueryResults[]> {
    const majorsPromise = this.majorModel.find();
    if (options.includes) {
      const query = extractQury(options.includes);
      if (query.school) {
        majorsPromise.populate('school');
      }
    }
    return await majorsPromise.lean();
  }

  async findOne(
    id: string,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    const majorPromise = this.majorModel.findById(id);
    if (options.includes) {
      const query = extractQury(options.includes);
      if (query.school) {
        majorPromise.populate('school');
      }
    }
    const major = await majorPromise.lean();
    if (!major) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return major;
  }

  async update(
    id: string,
    updateMajorDto: UpdateMajorDto,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    const exists = await this.majorModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    const majorPromise = this.majorModel.findByIdAndUpdate(id, updateMajorDto, {
      new: true,
    });
    if (options.includes) {
      const query = extractQury(options.includes);
      if (query.school) {
        majorPromise.populate('school');
      }
    }
    return await majorPromise.lean();
  }

  async remove(id: string, options: FindSchoolOptions): Promise<QueryResults> {
    const majorPromise = this.majorModel.findByIdAndDelete(id);
    if (options.includes) {
      const query = extractQury(options.includes);
      if (query.school) {
        majorPromise.populate('school');
      }
    }
    const major = await majorPromise.lean();
    if (!major) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return major;
  }
}
