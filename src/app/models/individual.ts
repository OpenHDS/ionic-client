export class Individual{
  extId: string;
  dob?: any;
  dobAspect?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  father?: any;
  mother?: any;
  collectedBy?: any; // String for db storage. Fieldworker object for sending to server.
  deleted?: boolean;
  insertDate?: Date;
  processed?: boolean;
  errorReported?: boolean;
  spouse?: string;
  bIsToA?: string;
  status?: string;
  syncedWithServer?: boolean;
  selected?: boolean;
  uuid: string;
}
