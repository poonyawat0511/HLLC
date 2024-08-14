import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { School } from './schemas/school.schema';

export type Subjects = InferSubjects<typeof School>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, School);
  },

  ADMIN({ can }) {
    can(Actions.manage, School);
  },
  LECTURER({ can }) {
    can(Actions.read, School);
  },
};
