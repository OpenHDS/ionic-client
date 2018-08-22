import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location} from "../../model/locations";
import { UUID } from "angular2-uuid";
import { SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {UserProvider} from "../user-provider/user-provider";
import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {Hierarchy} from "../../model/hierarchy";
import {Locations} from "../../model/entity-wrappers";

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocationsProvider extends DatabaseProviders{
  public db: OpenhdsDb;

  constructor(public http: HttpClient, public userProvider: UserProvider, public fwProvider: FieldworkerProvider,
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
    loc.syncedWithServer = false;
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

  async synchronizeOfflineLocations(){
    //Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    var offline = await this.db.locations
      .filter(loc => loc.syncedWithServer === false)
      .toArray();

    //Process and send data to server.
    await offline.forEach(async loc => {
      if (loc.processed) {
        await this.updateData(loc).then(() => {
          loc.syncedWithServer = true;
          this.update(loc);
        }).catch(() => {
          loc.syncedWithServer = false;
          loc.processed = false;
          this.update(loc);
        });
      }
    });
  }

  async updateData(locationData: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.systemConfig.getDefaultUser()+ ":" + this.systemConfig.getDefaultPassword()));

    const url = this.systemConfig.getServerURL() + "/locations2/pushUpdates";
    let convertedLoc = await this.shallowCopy(locationData);
    await this.http.put(url, {locations:[convertedLoc], timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data.toString());
      console.log("Update Successful");
    }, err => {
      throw "Updating failed...";
    });
  }

  async shallowCopy(loc){

    let location = new Location();
    location.uuid = loc.uuid.replace(/-/g, "");  //Remove the dashes from the uuid.

    let fieldworker = await this.fwProvider.getFieldworker(loc.collectedBy);
    location.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    location.extId = loc.extId;
    location.locationLevel = await this.locationHierarchyLevelServerCopy(loc.locationLevel);
    location.locationName = loc.locationName;
    location.locationType = loc.locationType;
    return location;
  }

  async locationHierarchyLevelServerCopy(level){
    let locLevel = new Hierarchy();
    locLevel.extId = level.extId;
    locLevel.uuid =  level.uuid;
    locLevel.name = level.name;
    locLevel.parent = level.parent;
    locLevel.level = level.level;

    return locLevel;
  }

  getLocationDBCount(): Promise<Number>{
    return this.db.locations.count();
  }
}
