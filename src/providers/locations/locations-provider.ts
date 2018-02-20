import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDb, Location } from "./locations-db";
import { NetworkConfigProvider } from "../network-config/network-config";
import { UUID } from "angular2-uuid";
import { ErrorsDb, Errors } from "../errors/errors-db";
import { ErrorsProvider } from "../errors/errors";
import { EntityErrorLabels } from "../errors/entity-error-labels";
import {SystemConfigProvider} from "../system-config/system-config";

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

  constructor(public http: HttpClient, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider, public systemConfig: SystemConfigProvider) {
    this.db = new LocationDb();
  }

  async initProvider(): Promise<Location[]>{
    let dataUrl = this.systemConfig.getServerURL() + "locations2";
    if(localStorage.getItem('lastUpdate') == null){
      return await this.loadData(dataUrl).then(() => this.getAllLocations());
    } else {
      return await this.updateLocationsList().then(() => this.getAllLocations());
    }
  }

  private async loadData(url: string){
    const locations: Location[] = [];

    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    await this.http.get(url, {headers}).subscribe(data => {
        for (let loc of data['locations']) {
          locations.push({
            uuid: loc.uuid,
            extId: loc.extId,
            locationName: loc.locationName,
            locationType: loc.locationType,
            longitude: loc.longitude,
            latitude: loc.latitude,
            accuracy: loc.accuracy,
            altitude: loc.altitude,
            deleted: Boolean(loc.deleted),
            insertDate: loc.insertDate,
            clientInsert: data['timestamp'],
            collectedBy: {
              extId: "FWDW1"
            },
            locationLevel: {
              extId: "MBI"
            },
            processed: 1
          });
        }

        this.db.transaction('rw', this.db.locations, () => {
          this.db.locations.bulkPut(locations).catch(error => console.log(error));
        }).then(() => localStorage.setItem('lastUpdate', data['timestamp'])).catch(error => console.log(error));

    });
  }

  //Get all location in the database
  getAllLocations(){
      return this.db.locations.toArray();
  }

  //Pull updates from the server
  async updateLocationsList(): Promise<Location[]>{
    const url = this.systemConfig.getServerURL() + "locations2/pull/" + localStorage.getItem("lastUpdate");
    return await this.loadData(url).catch(error => console.log(error)).then(() => this.getAllLocations());
  }

  //Save a location. If network connection save locally and to the server.
  saveData(loc: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    loc.collectedBy = {
      extId: "FWEK1D"
    };

    loc.locationLevel =  {
      extId: "MBI"
    };

    //Configure UUID on client side. Check to make sure it isn't null. If not null, and error is being resolved.
    if(!loc.uuid)
      loc.uuid = UUID.UUID();

    loc.deleted = false;
    loc.clientInsert = new Date().getTime();
    if(this.networkConfig.isConnected()){

      //Get only data that needs to be sent to the server
      let postData = this.getNewServerLocationEntity(loc);

      this.http.post(this.systemConfig.getServerURL() + "locations2/", postData, {headers}).subscribe(data => {
        loc.processed = 1;
        if(this.validateLocationExistence(loc).then(x => true)){
          this.update(loc, data['timestamp'])
        } else {
          this.add(loc, data['timestamp'])
        }
      }, error => {
        this.errorsProvider.updateOrSetErrorStatus(this.generateNewError(error, loc));
      });
    } else {
     this.add(loc, new Date().getTime());
    }
  }

  updateData(location: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    var sendData = this.getNewServerLocationEntity(location);
    const url = this.systemConfig.getServerURL() + "locations2/pushUpdates";
    this.http.put("http://localhost:8080/openhds/api2/rest/locations2/pushUpdates", sendData, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data['timestamp']);
    }, err => {
      this.errorsProvider.updateOrSetErrorStatus(this.generateNewError(err, location));
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
      .filter(loc => loc.clientInsert >= Number.parseInt(localStorage.getItem('lastUpdate')) || loc.processed == 0)
      .toArray();

    //Process and send data to server.
    offline.forEach(loc => {
      if(loc.processed)
        this.updateData(loc);
      else
        this.saveData(loc);
    })
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
  add(loc: Location, timestamp: number){
    this.db.locations.add(loc).then(() => {
      localStorage.setItem('lastUpdate', timestamp.toString())
    }).catch(err => console.log(err));
  }

  update(loc: Location, timestamp:number){
    this.db.locations.update(loc.extId, loc).then(() => {
      localStorage.setItem('lastUpdate', timestamp.toString())
    }).catch(err => console.log(err));
  }
}
