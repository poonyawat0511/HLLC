import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { ReportCategory } from './schemas/report-category.schema';

export type Subjects = InferSubjects<typeof ReportCategory>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, ReportCategory);
  },

  ADMIN({ can }) {
    can(Actions.manage, ReportCategory);
  },

  USER({ can, user }) {
    can(Actions.read, ReportCategory, { authorId: user.id });
  },
};
