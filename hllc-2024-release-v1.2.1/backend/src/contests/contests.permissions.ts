import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Contest } from './schemas/contest.schema';

export type Subjects = InferSubjects<typeof Contest>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Contest);
  },

  ADMIN({ can }) {
    can(Actions.manage, Contest);
  },

  USER({ can }) {
    can(Actions.read, Contest);
  },
};
