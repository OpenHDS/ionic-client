import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {Individual, IndividualDb} from "./individual-db";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndividualProvider {

  private db: IndividualDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    this.db = new IndividualDb();
  }

  async initProvider(){
    let dataUrl = this.systemConfig.getServerURL() + "/individuals2";
    if(localStorage.getItem("individualLastUpdate") == null){
      this.loadData(dataUrl);
    }
  }

  private async loadData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let ind: Individual[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      ind = data['individuals'];
      timestamp = data['timestamp'];
    }).catch((err) => {
      throw "Error getting data occurred";
    });

    ind.forEach(x => {
      x.collectedBy = {
        extId: "FWDW1"
      };

      x.selected = false;
      x.clientInsert = timestamp;
      x.processed = 1;
    });

    await this.db.transaction('rw', this.db.individuals, () => {
      this.db.individuals.bulkPut(ind).catch(error => console.log(error))
        .then(() => localStorage.setItem('individualLastUpdate', timestamp));
    })

  }

  //Get all location in the database
  getAllIndividuals(){
    return this.db.individuals.toArray();
  }

  async saveDataLocally(ind: Individual){
    ind.collectedBy = {
      extId: "FWEK1D"
    };

    if(!ind.uuid)
      ind.uuid = UUID.UUID();

    ind.deleted = false;
    ind.selected = false;
    ind.processed = 0;
    ind.clientInsert = new Date().getTime();

    await this.insert(ind);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(ind: Individual){
    this.db.individuals.add(ind).catch(err => console.log(err));
  }
}
