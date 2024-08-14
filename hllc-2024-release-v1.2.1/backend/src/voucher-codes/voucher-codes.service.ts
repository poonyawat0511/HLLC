import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoucherCodeDto } from './dto/create-voucher-code.dto';
import { UpdateVoucherCodeDto } from './dto/update-voucher-code.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VoucherCode } from './schemas/voucher-codes.schema';
import { ErrorBuilder, ErrorMethod } from 'src/app/common/utils/error.util';
import { Voucher } from '../vouchers/schemas/vouchers.schema';
@Injectable()
export class VoucherCodesService {
  private readonly errorBuilder = new ErrorBuilder('voucher-code');

  constructor(
    @InjectModel(VoucherCode.name)
    private voucherCodeModel: Model<VoucherCode>,
    @InjectModel(Voucher.name)
    private voucherModel: Model<Voucher>,
  ) {}

  async generateVoucherCodes(
    createVoucherDto: CreateVoucherCodeDto,
  ): Promise<string[]> {
    const { acronym, count, voucher } = createVoucherDto;
  
    const existingCodes = await this.voucherCodeModel
      .find({ code: { $regex: `^${acronym}` } })
      .lean();
  
    const existingCodeSet = new Set(
      existingCodes.map((code: any) => code.code),
    );
  
    const lastCodeNumber = existingCodes
      .map((code: any) => parseInt(code.code.replace(acronym, ''), 10))
      .reduce((max, num) => (num > max ? num : max), 0);
  
    const newCodes = [];
    for (let i = 1; i <= count; i++) {
      const newCodeNumber = lastCodeNumber + i;
      const newCode = `${acronym}${newCodeNumber.toString().padStart(6, '0')}`;
      if (!existingCodeSet.has(newCode)) {
        newCodes.push(newCode);
      }
    }

    const vouchers = newCodes.map((code) => ({
      code,
      voucher,
      user: null,
    }));
  
    await this.voucherCodeModel.insertMany(vouchers);
  
    return newCodes;
  }
  

  async getExistsVoucherCodes(userId: string): Promise<{ voucher: Voucher; exists: boolean }[]> {
    const vouchers = await this.voucherModel
      .find({ type: 'GLOBAL' })
      .populate('sponsor')
      .lean();
  
    const codes = await Promise.all(
      vouchers.map(async (voucher) => {
        const exists = await this.voucherCodeModel.exists({
          user: userId,
          voucher: voucher._id,
        });
        const availableVoucher = await this.voucherCodeModel.exists({
          user: null,
          voucher: voucher._id,
        });
        return { voucher, exists: !!exists, availableVoucher: !!availableVoucher };
      }),
    );
  
    return codes.filter((code) => !code.exists && code.availableVoucher);
  }

  async findByUserId(userId: string): Promise<VoucherCode[]> {
    const voucherCode = await this.voucherCodeModel
      .find({ user: userId })
      .populate({ path: 'voucher', populate: { path: 'sponsor' } })
      .lean();
    return voucherCode;
  }

  async findByCode(codeId: string): Promise<VoucherCode> {
    const voucherCode = await this.voucherCodeModel
      .findOne({ code: codeId })
      .populate({ path: 'voucher', populate: { path: 'sponsor' } })
      .lean();
    return voucherCode;
  }
  
  async findByVoucherId(voucherId: string): Promise<VoucherCode> {
    const voucherCode = await this.voucherCodeModel
      .findOne({
        user: null,
        voucher: voucherId,
      })
      .populate({ path: 'voucher', populate: { path: 'sponsor' } })
      .lean();
      
      if (!voucherCode) {
        throw new NotFoundException(`Voucher code not found for voucher ID ${voucherId}`);
      }
    return voucherCode;
  }

  async findAll(): Promise<VoucherCode[]> {
    const voucherCode = await this.voucherCodeModel
      .find()
      .populate({ path: 'voucher', populate: { path: 'sponsor' } })
      .populate('user')
      .lean();
    return voucherCode;
  }

  async findOne(id: string): Promise<VoucherCode> {
    const voucherCodes = await this.voucherCodeModel
      .findById(id)
      .populate({ path: 'voucher', populate: { path: 'sponsor' } })
      .lean();
    return voucherCodes;
  }

  async update(
    id: string,
    updateVoucherCodeDto: UpdateVoucherCodeDto,
  ): Promise<VoucherCode> {
    const exists = await this.voucherCodeModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const voucherCode = await this.voucherCodeModel
      .findByIdAndUpdate(id, updateVoucherCodeDto, { new: true })
      .lean();

    return voucherCode;
  }

  async remove(id: string): Promise<VoucherCode> {
    const voucherCode = await this.voucherCodeModel
      .findByIdAndDelete(id)
      .lean();
    if (!voucherCode) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return voucherCode;
  }
}
