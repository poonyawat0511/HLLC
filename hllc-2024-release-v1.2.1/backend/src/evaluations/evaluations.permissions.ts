import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Evaluation } from './schemas/evaluation.schema';

export type Subjects = InferSubjects<typeof Evaluation>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Evaluation);
  },

  ADMIN({ can }) {
    can(Actions.manage, Evaluation);
  },

  USER({ can, user }) {
    can(Actions.create, Evaluation, { userId: user.id });
    can(Actions.read, Evaluation, { userId: user.id });
  },
};
