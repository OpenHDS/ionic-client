import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {Location, LocationDb} from "../locations/locations-db";
import {ErrorsProvider} from "../errors/errors";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {Fieldworker, FieldworkerDb} from "./fieldworker-db";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FieldworkerProvider {

  private db: FieldworkerDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    this.db = new FieldworkerDb();
  }

  async initProvider(){
    let dataUrl = this.systemConfig.getServerURL() + "/fieldworkers2";
    if(localStorage.getItem("fwUpdate") == null){
      this.loadData(dataUrl);
    }
  }

  private async loadData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let fw: Fieldworker[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      fw = data['fieldWorkers'];
      timestamp = data['timestamp'];
    }).catch((err) => {
      throw "Error getting data occurred";
    });

    fw.forEach(x => {
      x.processed = 1;
    });

    await this.db.transaction('rw', this.db.fieldworker, () => {
      this.db.fieldworker.bulkPut(fw).catch(error => console.log(error))
        .then(() => localStorage.setItem('fwLastUpdate', timestamp));
    })

  }

  //Get all location in the database
  getAllFieldworkers(){
    return this.db.fieldworker.toArray();
  }

   async getFieldworker(extId: string){
    var fw;

    fw = await this.db.fieldworker.where("extId").equals(extId).toArray();
    console.log(fw);
    return fw;
  }

  async saveDataLocally(fw: Fieldworker){
    await this.insert(fw);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(fw: Fieldworker){
    this.db.fieldworker.add(fw).catch(err => console.log(err));
  }
}
