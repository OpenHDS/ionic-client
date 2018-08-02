import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location} from "../../interfaces/locations";
import { NetworkConfigProvider } from "../network-config/network-config";
import { UUID } from "angular2-uuid";
import {Errors} from "../../interfaces/data-errors";
import { ErrorsProvider } from "../errors/errors";
import { EntityErrorLabels } from "../errors/entity-error-labels";
import { SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {LocationHierarchiesProvider} from "../location-hierarchies/location-hierarchies";
import {UserProvider} from "../user-provider/user-provider";

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocationsProvider extends DatabaseProviders{
  private db: OpenhdsDb;

  constructor(public http: HttpClient, public errorsProvider: ErrorsProvider, public userProvider: UserProvider,
              public systemConfig: SystemConfigProvider, public locHierarchyProvider: LocationHierarchiesProvider) {
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
