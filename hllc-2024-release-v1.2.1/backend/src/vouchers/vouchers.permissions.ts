import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Voucher } from './schemas/vouchers.schema';

export type Subjects = InferSubjects<typeof Voucher>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Voucher);
  },

  ADMIN({ can }) {
    can(Actions.manage, Voucher);
  },

  SPONSOR({ can }) {
    can(Actions.manage, Voucher);
  },

  USER({ can }) {
    can(Actions.read, Voucher);
    can(Actions.update, Voucher);
  },

  AE({ can }) {
    can(Actions.read, Voucher);
    can(Actions.update, Voucher);
  }
};
