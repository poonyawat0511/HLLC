import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Admin } from './schemas/admin.schema';
import { Activity } from 'src/activities/schemas/activities.schema';

export type Subjects = InferSubjects<typeof Admin>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can, cannot }) {
    cannot(Actions.manage, Admin);
    can(Actions.read, Activity);
  },

  ADMIN({ can }) {
    can(Actions.manage, Admin);
  },

  STAFF({ can }) {
    can(Actions.read, Admin);
  },

  AE({ can }) {
    can(Actions.read, Admin);
  },
};
