import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Item } from './schemas/item.schema';

export type Subjects = InferSubjects<typeof Item>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Item);
  },

  USER({ can }) {
    can(Actions.read, Item);
  },

  ADMIN({ can }) {
    can(Actions.manage, Item);
  },
};
