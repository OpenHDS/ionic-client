import {Individual} from "./individual";

export interface SocialGroup{
  extId: string;
  groupName: string;
  groupType: string;
  groupHead: Individual;
  collectedBy: string;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed: boolean;
  errorReported?: boolean;
  selected: boolean;
}
