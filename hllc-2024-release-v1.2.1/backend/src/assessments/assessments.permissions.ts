import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Assessment } from './schemas/assessments.schema';

export type Subjects = InferSubjects<typeof Assessment>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Assessment);
  },

  ADMIN({ can }) {
    can(Actions.manage, Assessment);
  },
};
