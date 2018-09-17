import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../../models/locations';
import { UUID } from 'angular2-uuid';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {AuthService} from '../AuthService/auth.service';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {SystemConfigService} from '../SystemService/system-config.service';
import {Hierarchy} from '../../models/hierarchy';


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

  constructor(public http: HttpClient, public authProvider: AuthService, public fwProvider: FieldworkerService,
              public systemConfig: SystemConfigService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const loc = await this.initProvider('locations').catch(error => {console.log(error); throw error; });
    loc.forEach(x => this.insert(x));
  }

  // Get all location in the database
  getAllLocations() {
      return this.db.locations.toArray();
  }

  async saveDataLocally(loc: Location) {
    loc.collectedBy = this.authProvider.getLoggedInFieldworker();

    // Check to see if location already exists!
    const find = await this.db.locations.where('extId').equals(loc.extId).toArray();

    if (find.length != 0) {
      throw new Error(('Location with given external Id already exists.'));
    }

    if (!loc.uuid) {
      loc.uuid = UUID.UUID();
    }

    loc.deleted = false;
    loc.syncedWithServer = false;
    loc.processed = false;
    loc.clientInsert = new Date().getTime();

    await this.insert(loc);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(loc: Location) {
    this.db.locations.put(loc).catch(err => console.log(err));
  }

  async update(loc: Location) {
    this.db.locations.put(loc).catch(err => console.log(err));
  }

  async synchronizeOfflineLocations() {
    // Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const offline = await this.db.locations
      .filter(loc => loc.syncedWithServer === false)
      .toArray();

    // Process and send data to server.
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

  async updateData(locationData: Location) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));

    const url = this.systemConfig.getServerURL() + '/locations2/pushUpdates';
    const convertedLoc = await this.shallowCopy(locationData);
    await this.http.put(url, {locations: [convertedLoc], timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data.toString());
      console.log('Update Successful');
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  async shallowCopy(loc) {

    const location = new Location();
    location.uuid = loc.uuid.replace(/-/g, '');  // Remove the dashes from the uuid.

    const fieldworker = await this.fwProvider.getFieldworker(loc.collectedBy);
    location.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    location.extId = loc.extId;
    location.locationLevel = await this.locationHierarchyLevelServerCopy(loc.locationLevel);
    location.locationName = loc.locationName;
    location.locationType = loc.locationType;
    return location;
  }

  async locationHierarchyLevelServerCopy(level) {
    const locLevel = new Hierarchy();
    locLevel.extId = level.extId;
    locLevel.uuid =  level.uuid;
    locLevel.name = level.name;
    locLevel.parent = level.parent;
    locLevel.level = level.level;

    return locLevel;
  }

  getLocationDBCount(): Promise<Number> {
    return this.db.locations.count();
  }
}
