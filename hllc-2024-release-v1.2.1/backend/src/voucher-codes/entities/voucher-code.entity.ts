import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Voucher } from 'src/vouchers/schemas/vouchers.schema';
import { VoucherEntity } from 'src/vouchers/entities/voucher.entity';
import { User } from 'src/users/schemas/user.schema';
import { UserEntity } from 'src/users/entities/user.entity';
export class VoucherCodeEntity extends MongoEntity {
  @TransformId((value) => new VoucherEntity(value))
  voucher?: Types.ObjectId | Voucher | null;

  @TransformId((value) => new UserEntity(value))
  user?: Types.ObjectId | User | null;

  constructor(partial: Partial<VoucherCodeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
