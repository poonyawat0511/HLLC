import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { VoucherCode } from './schemas/voucher-codes.schema';


export type Subjects = InferSubjects<typeof VoucherCode>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, VoucherCode);
  },

  ADMIN({ can }) {
    can(Actions.manage, VoucherCode);
  },

  USER({ can, user }) {
    can(Actions.read, VoucherCode, { userId: user.id });
    can(Actions.update, VoucherCode, { userId: user.id });

  },
};
