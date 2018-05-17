import Dexie from 'dexie';

import {SocialGroup} from "../social-group/socialGroup-db";
export class IndividualDb extends Dexie {
  individuals: Dexie.Table<Individual, string>;

  constructor() {
    super("Individual");
    this.version(1).stores({
      individuals: 'extId, dob, dobAspect, firstName, middleName, lastName, gender, mother, father, bIsToA, deleted, insertDate, clientInsert, uuid, processed'
    });
  }
}

export interface Individual{
  extId: string;
  dob: Date;
  dobAspect: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  father: Individual;
  mother: Individual;
  socialGroup: SocialGroup;
  collectedBy: {};
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  bIsToA: number;
  processed: number; //0 for not sent, 1 for sent, 2 for sent, but with error
  selected: boolean;
}
