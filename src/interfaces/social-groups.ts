import {Individual} from "./individual";

export class SocialGroup{
  extId: string;
  groupName: string;
  groupType: string;
  groupHead: Individual;
  collectedBy: any;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed: boolean;
  errorReported?: boolean;
  syncedWithServer?: boolean;
  selected?: boolean;

}
