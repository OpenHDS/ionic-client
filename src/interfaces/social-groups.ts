import {Individual} from "./individual";

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
