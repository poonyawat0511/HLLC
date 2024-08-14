import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Major } from './schemas/major.schema';


export type Subjects = InferSubjects<typeof Major>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Major);
  },

  ADMIN({ can }) {
    can(Actions.manage, Major);
  },
  LECTURER({ can }) {
    can(Actions.read, Major);
  },
};
