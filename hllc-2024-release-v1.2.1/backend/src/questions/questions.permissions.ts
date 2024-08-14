import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { Question } from './schemas/question.schema';


export type Subjects = InferSubjects<typeof Question>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, Question);
  },

  ADMIN({ can }) {
    can(Actions.manage, Question);
  },
};
