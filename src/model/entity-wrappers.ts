import {Location} from "./locations";

export class Locations{
  locations: Array<Object>;
  updatedTimestamp: Number;


  constructor(locations?: Location[], updatedTimestamp?){
    this.locations = locations;
    this.updatedTimestamp = updatedTimestamp;
  }

  toJSON(){
    console.log(this.locations);
    return {locations: this.locations, timestamp: this.updatedTimestamp};
  }
}


