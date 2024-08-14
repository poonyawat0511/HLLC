import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theme } from './schemas/theme.schema';
import { Model } from 'mongoose';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { flattenObject } from 'src/app/common/utils/object.util';

@Injectable()
export class ThemesService {
  private readonly errorBuilder = new ErrorBuilder('Theme');

  constructor(@InjectModel(Theme.name) private themeModel: Model<Theme>) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    try {
      const themeDoc = new this.themeModel(createThemeDto);
      const theme = await themeDoc.save();
      return theme.toObject();
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

  async findAll(): Promise<Theme[]> {
    const themes = await this.themeModel.find().populate('school').lean();
    return themes;
  }

  async findOne(id: string): Promise<Theme> {
    const theme = await this.themeModel.findById(id).populate('school').lean();
    if (!theme) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return theme;
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const exists = await this.themeModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const theme = await this.themeModel
      .findByIdAndUpdate(
        id,
        { $set: flattenObject(updateThemeDto) },
        { new: true },
      )
      .populate('school')
      .lean();

    return theme;
  }

  async remove(id: string): Promise<Theme> {
    const theme = await this.themeModel.findByIdAndDelete(id).lean();
    if (!theme) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return theme;
  }
}
