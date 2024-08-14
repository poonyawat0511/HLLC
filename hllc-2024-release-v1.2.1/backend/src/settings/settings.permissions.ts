import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Setting } from './schemas/settings.schema';

export type Subjects = InferSubjects<typeof Setting>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot, can }) {
    cannot(Actions.manage, Setting);
    can(Actions.read, Setting);
  },

  ADMIN({ can }) {
    can(Actions.manage, Setting);
  },
};
