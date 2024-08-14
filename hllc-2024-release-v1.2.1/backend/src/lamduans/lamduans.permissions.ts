import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Lamduan } from './schemas/lamduan.schema';

export type Subjects = InferSubjects<typeof Lamduan>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Lamduan);
  },

  ADMIN({ can }) {
    can(Actions.manage, Lamduan);
  },

  USER({ can, user }) {
    can(Actions.manage, Lamduan, { userId: user.id });
  },
};
