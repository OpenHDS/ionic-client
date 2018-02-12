import Dexie from 'dexie';

export class LocationDb extends Dexie {
  locations: Dexie.Table<Location, string>;

  constructor() {
    super("Location");
    this.version(1).stores({
      locations: 'extId, name, type, longitude, latitude, deleted, insertDate, clientInsert, uuid'
    });
  }
}

export interface Location{
  extId: string;
  locationName: string;
  locationType: string;
  longitude: string;
  latitude: string;
  accuracy: string;
  altitude: string;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
}
