import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDb, Location } from "./locations-db";
import {NetworkConfigProvider} from "../network-config/network-config";
import { UUID } from "angular2-uuid";
import {ErrorsDb, Errors} from "../errors/errors-db";
import {ErrorsProvider} from "../errors/errors";
import {EntityErrorLabels} from "../errors/entity-error-labels";

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
  }

  dataUrl = 'http://localhost:8080/openhds/api2/rest/locations2';

  constructor(public http: HttpClient, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider) {
    this.db = new LocationDb();
  }

  async initProvider(): Promise<Location[]>{
    if(localStorage.getItem('lastUpdate') == null){
      return await this.loadData(this.dataUrl).then(() => this.getAllLocations());
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

  getAllLocations(){
      return this.db.locations.toArray();
  }

  //Pull updates from the server
  async updateLocationsList(): Promise<Location[]>{
    const url = this.dataUrl + "/pull/" + localStorage.getItem("lastUpdate");
    console.log(url);
    return await this.loadData(url).catch(error => console.log(error)).then(() => this.getAllLocations());
  }

  saveData(loc: Location){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    if(this.networkConfig.isConnected()){
      //Dummy fields until Fieldworker and Location Hierarchy implemented
      loc.collectedBy = {
        extId: "FWEK1D"
      };

      loc.locationLevel =  {
          extId: "MBI"
      };

      //Configure UUID on client side
      loc.uuid = UUID.UUID();
      console.log(loc.uuid);
      loc.deleted = false;

      //Get only data that needs to be sent to the server
      let postData = {
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

      this.http.post("http://localhost:8080/openhds/api2/rest/locations2", postData, {headers}).subscribe(data => {
        loc.processed = 0;
        this.db.locations.add(loc).then(() => {
          localStorage.setItem('lastUpdate', data['timestamp'])
        }).catch(err => console.log(err));
      }, error => {
        console.log(error)
        let err: Errors = {
          extId: loc.extId,
          entityType: EntityErrorLabels.LOCATION_ERROR,
          entity: loc,
          errorMessage: error.error.errors[0],
          timestamp: new Date().getTime(),
          resolved: 0
        }

        this.errorsProvider.insert(err);
      });

    } else {
      //No network connection. Save locally.
      this.db.locations.add(loc).then(() => {
        localStorage.setItem('lastUpdate', new Date().getTime().toString())
      }).catch(err => console.log(err));
    }
  }
}
