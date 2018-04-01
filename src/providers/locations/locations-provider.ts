import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDb, Location } from "./locations-db";
import { NetworkConfigProvider } from "../network-config/network-config";
import { UUID } from "angular2-uuid";
import { ErrorsDb, Errors } from "../errors/errors-db";
import { ErrorsProvider } from "../errors/errors";
import { EntityErrorLabels } from "../errors/entity-error-labels";
import { SystemConfigProvider} from "../system-config/system-config";

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocationsProvider {
  private db: LocationDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    this.db = new LocationDb();
  }

  async initProvider(){
    let dataUrl = this.systemConfig.getServerURL() + "/locations2";
    if(localStorage.getItem('lastUpdate') == null){
      return await this.loadData(dataUrl);
    } else {
      return await this.updateLocationsList();
    }
  }

  private async loadData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let locations: Location[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      locations = data['locations'];
      timestamp = data['timestamp'];
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    locations.forEach(x => {
      x.collectedBy = {
        extId: "FWDW1"
      };

      x.selected = false;
      x.clientInsert = timestamp;
      x.processed = 1;
    })

    await this.db.transaction('rw', this.db.locations, () => {
      this.db.locations.bulkPut(locations).catch(error => console.log(error))
        .then(() => localStorage.setItem('lastUpdate', timestamp));
    })
  }

  //Get all location in the database
  getAllLocations(){
      return this.db.locations.toArray();
  }

  //Pull updates from the server
  async updateLocationsList(){
    const url = this.systemConfig.getServerURL() + "/locations2/pull/" + localStorage.getItem("lastUpdate");
    return await this.loadData(url);
  }

  async saveDataLocally(loc: Location){
    loc.collectedBy = {
      extId: "FWEK1D"
    };


    if(!loc.uuid)
      loc.uuid = UUID.UUID();

    loc.deleted = false;
    loc.selected = false;
    loc.processed = 0;
    loc.clientInsert = new Date().getTime();

    await this.insert(loc);
  }

  //Save a location. If network connection save locally and to the server.
  async saveData(loc: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

      //Get only data that needs to be sent to the server
      let postData = this.getNewServerLocationEntity(loc);

      this.http.post(this.systemConfig.getServerURL() + "/locations2/", postData, {headers}).subscribe(async (data) => {
        loc.processed = 1;
        await this.insert(loc);
        localStorage.setItem('lastUpdate', data['timestamp'])
      }, error => {
        let serverError = this.generateNewError(error, loc);
        this.errorsProvider.updateOrSetErrorStatus(serverError);

        throw "Saving failed..."
      });

  }

  updateData(location: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    var sendData = this.getNewServerLocationEntity(location);
    let locations = {locations: sendData, timestamp: location.clientInsert};
    const url = this.systemConfig.getServerURL() + "/locations2/pushUpdates";

    this.http.put(url, locations, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data['timestamp']);
      location.processed = 1;
      this.db.locations.put(location)
    }, err => {
      if(err.errors[0] != null)
        this.errorsProvider.updateOrSetErrorStatus(this.generateNewError(err, location));
      throw "Updating failed...";
    });

  }

  resolveErrors(error: Errors){
    if(this.saveData(error.entity)){
      error.resolved = 1;
      this.errorsProvider.updateOrSetErrorStatus(error);
    }
  }

  async synchronizeOfflineLocations(){
    //Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    var offline = await this.db.locations
      .filter(loc => loc.clientInsert > Number.parseInt(localStorage.getItem('lastUpdate')) || loc.processed == 0)
      .toArray();

    //Process and send data to server.
    offline.forEach(loc => {
      if(loc.processed)
        this.updateData(loc);
      else
        this.saveData(loc);
    })
  }

  getLocationDBCount(): Promise<Number>{
    return this.db.locations.count();
  }

  //Creates a reduced version of a location to send to the server
  getNewServerLocationEntity(loc: Location){
    return {
      uuid: loc.uuid,
      locationName: loc.locationName,
      extId: loc.extId,
      locationType: loc.locationType,
      locationLevel: loc.locationLevel,
      collectedBy: loc.collectedBy,
      longitude: loc.longitude,
      latitude: loc.latitude,
      deleted: loc.deleted,
      insertDate: new Date()
    };
  }

  //Generate a new error based on error returned from server for a given location.
  generateNewError(error, loc: Location){
    return {
      uuid: loc.uuid,
      entityType: EntityErrorLabels.LOCATION_ERROR,
      entity: loc,
      errorMessage: error.error.errors[0],
      timestamp: new Date().getTime(),
      resolved: 0
    }
  }

  async validateLocationExistence(location: Location){
    let loc = await this.db.locations.filter(loc => loc.extId == location.extId);
    if(loc[0] != null)
      return true;

    return false;
  }

  //Abstract Updates and Adds to prevent errors
  async insert(loc: Location){
    this.db.locations.add(loc).catch(err => console.log(err));
  }
}
