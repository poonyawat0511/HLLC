import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Report } from './schema/reports.schema';

export type Subjects = InferSubjects<typeof Report>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Report);
  },

  ADMIN({ can }) {
    can(Actions.manage, Report);
  },

  USER({ can, user }) {
    can(Actions.create, Report, { userId: user.id });
    can(Actions.read, Report, { userId: user.id });
  },
};
