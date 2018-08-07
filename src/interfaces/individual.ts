import {Fieldworker} from "./fieldworker";

export class Individual{
  extId: string;
  dob?: Date;
  dobAspect?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  father?: Individual;
  mother?: Individual;
  collectedBy?: any; //String for db storage. Fieldworker object for sending to server.
  deleted?: boolean;
  insertDate?: Date;
  processed?: boolean;
  errorReported?: boolean;
  spouse?: string;
  bIsToA?: string;
  uuid: string;
}
