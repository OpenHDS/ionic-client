export interface Location{
  extId: string;
  locationName: string;
  locationType: string;
  longitude: number;
  latitude: number;
  accuracy: number;
  altitude: number;
  collectedBy: string;
  locationLevel: string;
  deleted: boolean;
  insertDate: Date;
  clientInsert: number;
  uuid: string;
  processed: boolean; //false, if error or not approved, true otherwise.
  selected: boolean;
}
