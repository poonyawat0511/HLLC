import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Evolution } from './schemas/evolution.schema';

export type Subjects = InferSubjects<typeof Evolution>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Evolution);
  },

  USER({ can, user }) {
    can(Actions.create, Evolution, { user: user.id });
    can(Actions.update, Evolution, { user: user.id });
  },

  ADMIN({ can }) {
    can(Actions.manage, Evolution);
  },
};
