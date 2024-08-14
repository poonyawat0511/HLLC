import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Posttest } from './schemas/posttest.schema';

export type Subjects = InferSubjects<typeof Posttest>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Posttest);
  },

  ADMIN({ can }) {
    can(Actions.manage, Posttest);
  },

  USER({ can, user }) {
    can(Actions.read, Posttest, { authorId: user.id });
    can(Actions.create, Posttest, { authorId: user.id });
  },
};
