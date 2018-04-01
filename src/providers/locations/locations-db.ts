import Dexie from 'dexie';
import {Hierarchy} from "../location-hierarchies/hierarchy-db";

export class LocationDb extends Dexie {
  locations: Dexie.Table<Location, string>;

  constructor() {
    super("Location");
    this.version(1).stores({
      locations: 'extId, name, type, longitude, latitude, deleted, insertDate, clientInsert, uuid, processed'
    });
  }
}

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
