import Dexie from 'dexie';
import {Individual} from "../individual/individual-db";

export class SocialGroupDb extends Dexie {
  socialGroup: Dexie.Table<SocialGroup, string>;

  constructor() {
    super("SocialGroup");
    this.version(1).stores({
      socialGroup: 'extId, groupName, groupType, groupHead, deleted, insertDate, clientInsert, uuid, processed'
    });
  }
}

export interface SocialGroup{
  extId: string;
  groupName: string;
  groupType: string;
  groupHead: Individual;
  collectedBy: {};
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed: number; //0 for not sent, 1 for sent, 2 for sent, but with error
  selected: boolean;
}
