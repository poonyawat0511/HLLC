import { Theme } from 'src/themes/schemas/theme.schema';
import { User } from 'src/users/schemas/user.schema';

export interface Profile extends User {
  pretest: 0 | 1;
  posttest: 0 | 1;
  theme?: Theme | null;
}
