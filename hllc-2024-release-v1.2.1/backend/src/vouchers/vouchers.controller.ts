import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ClassSerializerInterceptor,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherEntity } from './entities/voucher.entity';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Voucher } from './schemas/vouchers.schema';
import  VoucherInterface  from './interfaces/vouchers.interface'

type ImageVoucherUploadFields =
  | 'voucherImages[main]'
  | 'voucherImages[front]'
  | 'voucherImages[back]';

type UploadedImageVouchers = {
  [K in ImageVoucherUploadFields]?: Express.Multer.File[];
};

type UploadOptins = { name: ImageVoucherUploadFields; maxCount: number };

const UPLOAD_FIELDS: UploadOptins[] = [
  { name: 'voucherImages[main]', maxCount: 1 },
  { name: 'voucherImages[front]', maxCount: 1 },
  { name: 'voucherImages[back]', maxCount: 1 },
];

const voucherImageUploadInterCepters = FileFieldsInterceptor(UPLOAD_FIELDS, {
  storage: storageConfig,
});

/**
 * A function to transform file into photos object
 * @param files multer file upload
 * @returns photos object
 */
function getImageVouchersFromFiles(files: UploadedImageVouchers, clean?: boolean) {
  const photos = {
    main: files['voucherImages[main]']?.[0]?.filename ?? null,
    front: files['voucherImages[front]']?.[0]?.filename ?? null,
    back: files['voucherImages[back]']?.[0]?.filename ?? null,
  };
  if (!clean) return photos as VoucherInterface['voucherImages'];
  return Object.fromEntries(
    Object.entries(photos).filter(([, v]) => v !== null),
  ) as VoucherInterface['voucherImages'];
}

@Controller('vouchers')
export class VouchersController {
  private readonly messageBuilder = new MessageBuilder('voucher');
  constructor(private readonly vouchersService: VouchersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Voucher)
  @Get()
  async findAll() {
    const vouchers = await this.vouchersService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      vouchers.map((contest) => new VoucherEntity(contest)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, voucherImageUploadInterCepters)
  @Post()
  async create(
    @UploadedFiles() files: UploadedImageVouchers,
    @Body() createVoucherDto: CreateVoucherDto,
  ): Promise<ResponseDto<any>> {
    const voucherImages = getImageVouchersFromFiles(files)
    const voucher = await this.vouchersService.create({
      ...createVoucherDto,
      voucherImages,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new VoucherEntity(voucher),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Voucher)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const voucher = await this.vouchersService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new VoucherEntity(voucher),
    );
  }

  @UseInterceptors(voucherImageUploadInterCepters)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Voucher)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
    @UploadedFiles() files: UploadedImageVouchers,
  ): Promise<any> {
    const existingVoucher = await this.vouchersService.findOne(id,);
    if (files) {
      const voucherImages = getImageVouchersFromFiles(files);
      updateVoucherDto.voucherImages = {
        main: voucherImages.main || existingVoucher.voucherImages.main,
        front: voucherImages.front || existingVoucher.voucherImages.front,
        back: voucherImages.back || existingVoucher.voucherImages.back,
      };
    }
    if (updateVoucherDto.voucherImages === undefined) {
      updateVoucherDto.voucherImages = existingVoucher.voucherImages;
    }
    const voucher = await this.vouchersService.update(id, updateVoucherDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new VoucherEntity(voucher),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Voucher)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const voucher = await this.vouchersService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new VoucherEntity(voucher),
    );
  }
}
