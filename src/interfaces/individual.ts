import {SocialGroup} from "./social-groups";

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
