import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { VoucherCodesService } from './voucher-codes.service';
import { CreateVoucherCodeDto } from './dto/create-voucher-code.dto';
import { UpdateVoucherCodeDto } from './dto/update-voucher-code.dto';
import { VoucherCodeEntity } from './entities/voucher-code.entity';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { VoucherCode } from './schemas/voucher-codes.schema';


@Controller('voucher-codes')
export class VoucherCodesController {
  private readonly messageBuilder = new MessageBuilder('voucher-code');
  constructor(private readonly voucherCodesService: VoucherCodesService) {}

  // Generate voucher codes
  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.create, VoucherCode)
  @Post('generate')
  async generateVouchers(
    @Body() createVoucherCodeDto: CreateVoucherCodeDto,
  ): Promise<{ voucherCode: string[] }> {
    const voucherCode =
      await this.voucherCodesService.generateVoucherCodes(createVoucherCodeDto);
    return { voucherCode };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get('exists')
  async getExistsVoucherCodes(@Req() req: Request,) {
    const voucherCodes = await this.voucherCodesService.getExistsVoucherCodes(req['user'].id,);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      voucherCodes.map((v) => new VoucherCodeEntity(v)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get()
  async findAll() {
    const voucherCodes = await this.voucherCodesService.findAll();
    const voucherCodeEntities = voucherCodes.map(
      (pretest) => new VoucherCodeEntity(pretest),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      voucherCodeEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const voucherCode = await this.voucherCodesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new VoucherCodeEntity(voucherCode),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get(':userId/user')
  async findByUserId(@Param('userId') userId: string) {
    const voucherCodes = await this.voucherCodesService.findByUserId(userId);
    const voucherCodeEntities = voucherCodes.map(
      (voucherCode) => new VoucherCodeEntity(voucherCode),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      voucherCodeEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get(':codeId/code')
  async findByCode(@Param('codeId') codeId: string) {
    const voucherCode = await this.voucherCodesService.findByCode(codeId);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      new VoucherCodeEntity(voucherCode)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, VoucherCode)
  @Get(':voucherId/voucher')
  async findByVoucherId(@Param('voucherId') voucherId: string) {
    const voucherCode = await this.voucherCodesService.findByVoucherId(voucherId);
    const voucherCodeEntities = new VoucherCodeEntity(voucherCode)
    return createResponse(
      HttpStatus.OK,
      'Found voucher code',
      voucherCodeEntities
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherCodeDto: UpdateVoucherCodeDto,
  ) {
    const voucherCode = await this.voucherCodesService.update(
      id,
      updateVoucherCodeDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new VoucherCodeEntity(voucherCode),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.delete, VoucherCode)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const voucherCode = await this.voucherCodesService.remove(id);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new VoucherCodeEntity(voucherCode),
    );
  }
}
