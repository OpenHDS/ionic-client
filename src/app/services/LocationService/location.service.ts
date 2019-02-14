import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../../models/location';
import { UUID } from 'angular2-uuid';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {AuthService} from '../AuthService/auth.service';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {SystemConfigService} from '../SystemService/system-config.service';
import {Hierarchy} from '../../models/hierarchy';
import {Events} from "@ionic/angular";
import {LocationHierarchyService} from "../LocationHierarchyService/location-hierarchy.service";
import {ErrorService} from "../ErrorService/error-service";


/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({
    providedIn: 'root',
})
export class LocationService extends DatabaseService {
  public db: OpenhdsDb;

  constructor(public http: HttpClient, public event: Events, public fwProvider: FieldworkerService,
              public systemConfig: SystemConfigService, public locHierarchyService: LocationHierarchyService,
              public errorsService: ErrorService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const loc = await this.initProvider('locations').catch(error => {console.log(error); throw error; });
    loc.forEach(x => this.insert(x));
  }

  // Get all location in the database
  async getAllLocations() {
      return await this.db.locations.toArray();
  }

  async saveDataLocally(loc) {
    if (!loc.uuid) {
      loc.uuid = UUID.UUID();
    }

    loc.status = 'C';
    loc.errorReported = false;
    loc.syncedWithServer = false;
    loc.processed = false;
    loc.deleted = false;
    loc.clientInsert = new Date().getTime();
    loc.insertDate =   new Date();

    return await this.insert(loc);
  }

  async insert(loc: Location) {
    let success = false;

    //Don't process null entity
    if(loc === null || loc === undefined)
      return success;

    this.db.locations.put(loc).then(() => success = true).catch(err => {success = false});
    return success;
  }

  async update(loc: Location) {
    this.db.locations.put(loc).catch(err => console.log(err));
  }

  async synchronizeOfflineLocations() {
    // Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const postOffline = await this.db.locations
      .filter(loc => loc.syncedWithServer === false && loc.status === 'C'   &&  loc.processed === true && loc.errorReported === false)
      .toArray();

    const shallowCopies = [];

    for(let i = 0; i < postOffline.length; i++){
      let shallow = await this.shallowCopy(postOffline[i]);
      shallowCopies.push(shallow);
    }

    if(shallowCopies.length > 0)
      await this.postData(shallowCopies);

    await this.db.locations
      .filter(loc => loc.syncedWithServer === false && loc.status === 'C' &&  loc.processed === true && loc.errorReported === false)
      .modify({syncedWithServer: true});


    //Send updated data currently offline
    const updateOffline = await this.db.locations
      .filter(loc => loc.syncedWithServer === false && loc.status === 'U'  &&  loc.processed === true  && loc.errorReported === false).toArray();

    let updatedShallowCopies = [];

    for(let i = 0; i < updateOffline.length; i++){
      let shallow = await this.shallowCopy(updateOffline[i]);
      updatedShallowCopies.push(shallow);
    }

    if(updatedShallowCopies.length > 0)
      await this.updateData(updatedShallowCopies);

    await this.db.locations
      .filter(loc => loc.syncedWithServer === false && loc.status === 'U' &&  loc.processed === true && loc.errorReported === false)
      .modify({syncedWithServer: true});
  }

  async postData(locationData: Array<Location>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/locations2/bulkInsert';
    console.log("Sending " + locationData.length + " locations to the server...");

    await this.http.post(url, {locations: locationData, timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let loc in data["errors"]){
          let id = data["errors"][loc].entityId;
          this.setErrorStatus(id);
        }

        this.errorsService.processErrors(data["errors"]);
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  async updateData(locationData: Array<Location>){
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/locations2/bulkUpdate';
    console.log("Sending " + locationData.length + " location updates to the server...");

    await this.http.put(url, {locations: locationData, timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let loc in data["errors"]){
          let id = data["errors"][loc];
          this.setErrorStatus(id);
        }
        this.errorsService.processErrors(data["errors"]);
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  setErrorStatus(id){
    let location = this.db.locations.where('extId').equals(id).toArray();
    location[0]["errorReported"]= true;

    this.update(location[0]);
  }

  async shallowCopy(loc) {

    const l = new Location();
    l.uuid = loc.uuid.replace(/-/g, '');  // Remove the dashes from the uuid.

    const fieldworker = await this.fwProvider.getFieldworker(loc.collectedBy);
    l.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    l.extId = loc.extId;
    l.locationLevel = await this.locationHierarchyLevelServerCopy(loc.locationLevel);
    l.locationName = loc.locationName;
    l.locationType = loc.locationType;

    return l;
  }

  async locationHierarchyLevelServerCopy(level) {
    let hLevel = await this.locHierarchyService.findHierarchy(level);
    const locLevel = new Hierarchy();
    locLevel.uuid = hLevel[0].uuid;
    locLevel.extId = hLevel[0].extId;
    locLevel.name = hLevel[0].name;

    return locLevel;
  }

  async filterLocationsByParentLevel(parentLevel: string) {
    let allLocations = await this.getAllLocations();
    allLocations = allLocations.filter(x => x.locationLevel === parentLevel || x.locationLevel.extId === parentLevel);
    return allLocations;
  }

  getLocationDBCount(): Promise<Number> {
    return this.db.locations.count();
  }

  async findLocationByExtId(locExtId){
    return await this.db.locations.where('extId').equals(locExtId).toArray();
  }

  async buildHierarchyForLocation(locExtId){
    let l = await this.findLocationByExtId(locExtId);
    if(l[0].locationLevel.hasOwnProperty("extId"))
      l[0].locationLevel = l[0].locationLevel.extId;
    let hierarchy = await this.locHierarchyService.buildHierarchy(l[0]);
    console.log(hierarchy);
    return hierarchy;
  }
}
