import Dexie from 'dexie';

export class LocationDb extends Dexie {
  locations: Dexie.Table<Location, string>;

  constructor() {
    super("Location");
    this.version(1).stores({
      locations: 'extId, name, type, longitude, latitude, deleted, insertDate, clientInsert, uuid, sentToServer'
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
  locationLevel: {};
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  sentToServer: boolean;
}
