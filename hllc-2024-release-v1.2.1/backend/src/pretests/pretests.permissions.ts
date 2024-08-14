import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Pretest } from './schemas/pretest.schema';

export type Subjects = InferSubjects<typeof Pretest>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Pretest);
  },

  ADMIN({ can }) {
    can(Actions.manage, Pretest);
  },

  USER({ can, user }) {
    can(Actions.read, Pretest, { authorId: user.id });
    can(Actions.create, Pretest, { authorId: user.id });
  },
};
