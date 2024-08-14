import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { Model } from 'mongoose';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { Sponsor } from './schemas/sponsors.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SponsorsService {
  private readonly errorBuilder = new ErrorBuilder('Sponsor');
  constructor(
    @InjectModel(Sponsor.name)
    private readonly sponsorModel: Model<Sponsor>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto) {
    try {
      const sponsorDoc = new this.sponsorModel(createSponsorDto);
      const sponsor = await sponsorDoc.save();
      return sponsor.toObject();
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

  findAll(): Promise<Sponsor[]> {
    const sponsors = this.sponsorModel.find().lean();
    return sponsors;
  }

  async findOne(id: string): Promise<Sponsor> {
    const sponsor = await this.sponsorModel.findById(id).lean();
    if (!sponsor) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return sponsor;
  }

  async update(
    id: string,
    updateSponsorDto: UpdateSponsorDto,
  ): Promise<Sponsor | null> {
    const exists = await this.sponsorModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const sponsor = await this.sponsorModel
      .findByIdAndUpdate(id, updateSponsorDto, { new: true })
      .lean();

    return sponsor;
  }

  async remove(id: string): Promise<Sponsor> {
    const sponsor = await this.sponsorModel.findByIdAndDelete(id).lean();
    if (!sponsor) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return sponsor;
  }
}
