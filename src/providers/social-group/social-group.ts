import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {Location, LocationDb} from "../locations/locations-db";
import {ErrorsProvider} from "../errors/errors";
import {SocialGroupDb, SocialGroup} from "./socialGroup-db";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocialGroupProvider {

  private db: SocialGroupDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    this.db = new SocialGroupDb();
  }

  async initProvider(){
    let dataUrl = this.systemConfig.getServerURL() + "/socialgroups2";
    if(localStorage.getItem("sgUpdate") == null){
      this.loadData(dataUrl);
    }
  }

  private async loadData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let sg: SocialGroup[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      sg = data['socialGroups'];
      timestamp = data['timestamp'];
    }).catch((err) => {
      throw "Error getting data occurred";
    });

    sg.forEach(x => {
      x.collectedBy = {
        extId: "FWDW1"
      };

      x.selected = false;
      x.clientInsert = timestamp;
      x.processed = 1;
    });

    await this.db.transaction('rw', this.db.socialGroup, () => {
      this.db.socialGroup.bulkPut(sg).catch(error => console.log(error))
        .then(() => localStorage.setItem('sgLastUpdate', timestamp));
    })

  }

  //Get all location in the database
  getAllSocialGroups(){
    return this.db.socialGroup.toArray();
  }

  async saveDataLocally(sg: SocialGroup){
    sg.collectedBy = {
      extId: "FWEK1D"
    };

    if(!sg.uuid)
      sg.uuid = UUID.UUID();

    sg.deleted = false;
    sg.selected = false;
    sg.processed = 0;
    sg.clientInsert = new Date().getTime();

    await this.insert(sg);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(sg: SocialGroup){
    this.db.socialGroup.add(sg).catch(err => console.log(err));
  }
}
