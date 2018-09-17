import {Hierarchy} from './hierarchy';

export class Location {
  extId: string;
  locationName: string;
  locationType: string;
  longitude: number;
  latitude: number;
  accuracy: number;
  altitude: number;
  collectedBy: any; // Fieldworker UUID for client side storage, Fieldworker object to send to server (converted before sync)
  locationLevel: any;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed?: boolean; // false, if error or not approved, true otherwise.
  errorReported?: boolean;
  syncedWithServer?: boolean;
  selected?: boolean;
}
