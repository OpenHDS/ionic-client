import {HttpClient, HttpHeaders} from '@angular/common/http';
import { OnInit, Injectable } from '@angular/core';
import {HierarchyLevelsDb, HierarchyLevels} from "./hierarchy-levels-db";
import {HierarchyDb, Hierarchy} from "./hierarchy-db";
import {SystemConfigProvider} from "../system-config/system-config";
import {Location} from "../locations/locations-db";

/*
  Generated class for the LocationHierarchiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationHierarchiesProvider {

  levelsDb: HierarchyLevelsDb;
  locHierarchyDb: HierarchyDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public systemConfig: SystemConfigProvider) {
    this.levelsDb = new HierarchyLevelsDb();
    this.locHierarchyDb = new HierarchyDb();
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
      console.log(levels);
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    levels.forEach(x => {
      x.extId = x.name;
    })

    await this.levelsDb.transaction('rw', this.levelsDb.levels, () => {
      this.levelsDb.levels.bulkPut(levels).catch(error => console.log(error));
    })
  }


  private async loadLocationHierarchyData(url: string) {
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.openhdsLogin.username + ":" + this.openhdsLogin.password));

    let hierarchy: Hierarchy[] = [];
    let timestamp = null;
    await this.http.get(url, {headers}).toPromise().then((data) => {
      hierarchy = data['locationHierarchies'];
      console.log(hierarchy);
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    await this.locHierarchyDb.transaction('rw', this.locHierarchyDb.hierarchy, () => {
      this.locHierarchyDb.hierarchy.bulkPut(hierarchy).catch(error => console.log(error));
    })
  }

  getLevels(): Promise<HierarchyLevels[]>{
    return this.levelsDb.levels.toArray();
  }

  getHierarchy(): Promise<Hierarchy[]>{
    return this.locHierarchyDb.hierarchy.toArray();
  }
}
