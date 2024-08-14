import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Sponsor } from './schemas/sponsors.schema';

export type Subjects = InferSubjects<typeof Sponsor>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Sponsor);
  },

  ADMIN({ can }) {
    can(Actions.manage, Sponsor);
  },

  SPONSOR({ can }) {
    can(Actions.manage, Sponsor);
  },

  USER({ can, user }) {
    can(Actions.read, Sponsor, { userId: user.id });
    can(Actions.update, Sponsor, { userId: user.id });
  },
};
