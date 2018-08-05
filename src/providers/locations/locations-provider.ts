import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location} from "../../interfaces/locations";
import { UUID } from "angular2-uuid";
import { SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {UserProvider} from "../user-provider/user-provider";


/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocationsProvider extends DatabaseProviders{
  public db: OpenhdsDb;

  constructor(public http: HttpClient, public userProvider: UserProvider,
              public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var loc = await this.initProvider("locations").catch(error => {console.log(error); throw error});
    loc.forEach(x => this.insert(x));
  }

  //Get all location in the database
  getAllLocations(){
      return this.db.locations.toArray();
  }

  async saveDataLocally(loc: Location){
    loc.collectedBy = this.userProvider.getLoggedInUser();

    //Check to see if location already exists!
    let find = await this.db.locations.where('extId').equals(loc.extId).toArray();

    if(find.length != 0){
      throw ("Location with given external Id already exists.");
    }

    if(!loc.uuid)
      loc.uuid = UUID.UUID();

    loc.deleted = false;
    loc.selected = false;
    loc.processed = false;
    loc.clientInsert = new Date().getTime();

    await this.insert(loc);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(loc: Location){
    this.db.locations.put(loc).catch(err => console.log(err));
  }

  async update(loc: Location){
    this.db.locations.put(loc).catch(err => console.log(err));
  }
}
