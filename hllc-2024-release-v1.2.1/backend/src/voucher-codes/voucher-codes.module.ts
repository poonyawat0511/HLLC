import { Module, forwardRef } from '@nestjs/common';
import { VoucherCodesService } from './voucher-codes.service';
import { VoucherCodesController } from './voucher-codes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherCode } from './schemas/voucher-codes.schema';
import { VoucherCodeSchema } from './schemas/voucher-codes.schema';
import { VouchersModule } from 'src/vouchers/vouchers.module';
import { UsersModule } from 'src/users/users.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './voucher-codes.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VoucherCode.name, schema: VoucherCodeSchema },
    ]),
    forwardRef(() => VouchersModule),
    forwardRef(() => UsersModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [VoucherCodesController],
  providers: [VoucherCodesService],
})
export class VoucherCodesModule {}
