import {Hierarchy} from "./hierarchy";

export interface Location{
  extId: string;
  locationName: string;
  locationType: string;
  longitude: number;
  latitude: number;
  accuracy: number;
  altitude: number;
  collectedBy: {};
  locationLevel: Hierarchy;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed: number; //0 for not sent, 1 for sent, 2 for sent, but with error
  selected: boolean;
}
