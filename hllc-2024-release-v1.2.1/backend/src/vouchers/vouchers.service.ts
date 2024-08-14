import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorBuilder, ErrorMethod } from 'src/app/common/utils/error.util';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './schemas/vouchers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VouchersService {
  private readonly errorBuilder = new ErrorBuilder('voucher');

  constructor(
    @InjectModel(Voucher.name)
    private voucherModel: Model<Voucher>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucherDoc = new this.voucherModel(createVoucherDto);
    const voucher = await voucherDoc.save();
    return voucher.toObject();
  }

  async findAll(): Promise<Voucher[]> {
    const vouchers = await this.voucherModel.find().populate('sponsor').lean();
    return vouchers;
  }

  async findOne(id: string): Promise<Voucher> {
    try {
      const voucher = await this.voucherModel
        .findById(id)
        .populate('sponsor')
        .lean();
      if (!voucher) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return voucher;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto) {
    const exists = await this.voucherModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const voucher = await this.voucherModel
      .findByIdAndUpdate(id, updateVoucherDto, { new: true })
      .lean();

    return voucher;
  }

  async remove(id: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findByIdAndDelete(id).lean();
    if (!voucher) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return voucher;
  }
}
