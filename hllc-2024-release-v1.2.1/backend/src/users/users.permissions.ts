import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { User } from './schemas/user.schema';
import { Activity } from 'src/activities/schemas/activities.schema';
import { Item } from 'src/items/schemas/item.schema';

export type Subjects = InferSubjects<
  typeof User | typeof Activity | typeof Item
>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, User);
    cannot(Actions.manage, Activity);
    cannot(Actions.manage, Item);
  },

  ADMIN({ can }) {
    can(Actions.manage, User);
  },

  USER({ can }) {
    can(Actions.read, User);
    can(Actions.read, Activity);
    can(Actions.read, Item);
  },
};
