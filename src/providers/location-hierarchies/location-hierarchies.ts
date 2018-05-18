import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {HierarchyLevels} from "../../interfaces/hierarchy-levels";
import {Hierarchy} from "../../interfaces/hierarchy";
import {OpenhdsDb} from "../database-providers/openhds-db";

/*
  Generated class for the LocationHierarchiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationHierarchiesProvider {

  db: OpenhdsDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public systemConfig: SystemConfigProvider) {
    this.db = new OpenhdsDb()
  }

  async initLevels(){
    return await this.loadLevels(this.systemConfig.getServerURL() + "/locationhierarchylevels2");
  }

  async initHierarchy(){
    return await this.loadLocationHierarchyData(this.systemConfig.getServerURL() + "/locationhierarchies2");
  }

  private async loadLevels(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let levels: HierarchyLevels[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      levels = data['locationHierarchies'];
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    levels.forEach(x => {
      x.extId = x.name;
    })

    await this.db.transaction('rw', this.db.levels, () => {
      this.db.levels.bulkPut(levels).catch(error => console.log(error));
    })
  }


  private async loadLocationHierarchyData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let hierarchy: Hierarchy[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      hierarchy = data['locationHierarchies'];
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    await this.db.transaction('rw', this.db.locationhierarchies, () => {
      this.db.locationhierarchies.bulkPut(hierarchy).catch(error => console.log(error));
    })
  }

  getLevels(): Promise<HierarchyLevels[]>{
    return this.db.levels.toArray();
  }

  getHierarchy(): Promise<Hierarchy[]>{
    return this.db.locationhierarchies.toArray();
  }
}
