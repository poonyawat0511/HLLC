import { Types } from 'mongoose';
import { Sponsor } from 'src/sponsors/schemas/sponsors.schema';

export type VoucherType = 'GLOBAL' | 'INDIVIDUAL';

interface  VoucherInterface {
  _id: Types.ObjectId;
  discount: {
    th: string;
    en: string;
  };
  condition: { th: string; en: string; id: string }[];
  voucherImages: {
    main: string;
    front: string;
    back: string;
  };
  sponsor: Sponsor | Types.ObjectId;
  exp: Date;
  acronym: string;
  type: VoucherType;
}

export default VoucherInterface
