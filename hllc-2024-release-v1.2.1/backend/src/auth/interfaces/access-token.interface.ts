import { AdminRoles, Roles } from '../enums/roles.enum';

export interface IAccessTokenPayload {
  id: string;
  username: string;
  roles: (Roles | AdminRoles)[];
}
