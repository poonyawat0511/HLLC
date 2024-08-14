import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Theme } from './schemas/theme.schema';

export type Subjects = InferSubjects<typeof Theme>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Theme);
  },

  ADMIN({ can }) {
    can(Actions.manage, Theme);
  },
};
