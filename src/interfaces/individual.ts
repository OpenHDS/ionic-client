import {Fieldworker} from "./fieldworker";

export interface Individual{
  extId: string;
  dob?: Date;
  dobAspect?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  father?: Individual;
  mother?: Individual;
  collectedBy?: Fieldworker;
  deleted?: boolean;
  insertDate?: Date;
  uuid: string;
}
