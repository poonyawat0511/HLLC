import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Roles } from 'src/auth/enums/roles.enum';
import { AssessmentSection } from './schemas/assessment-section.schema';


export type Subjects = InferSubjects<typeof AssessmentSection>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ cannot }) {
    cannot(Actions.manage, AssessmentSection);
  },

  ADMIN({ can }) {
    can(Actions.manage, AssessmentSection);
  },
};
