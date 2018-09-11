import {Role} from "./role";

export class User{
  uuid: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  roles: Set<Role>;
}
