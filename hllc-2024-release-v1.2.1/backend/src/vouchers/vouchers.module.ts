import { Module, forwardRef } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { Voucher } from './schemas/vouchers.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherSchema } from './schemas/vouchers.schema';
import { SponsorsModule } from 'src/sponsors/sponsors.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './vouchers.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),
    forwardRef(() => SponsorsModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),
    VouchersService,
  ],
})
export class VouchersModule {}
