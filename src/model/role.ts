import {Privilege} from "./privilege";

export class Role{
  uuid: string;
  name: string;
  description: string;
  privileges: Set<Privilege>;
}
