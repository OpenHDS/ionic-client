import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemConfigProvider} from "../system-config/system-config";

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on services
  and Angular DI.
*/

@Injectable()
export class DatabaseProviders {

  constructor(public http: HttpClient,
              public systemConfig: SystemConfigProvider) {
  }

  async initProvider(entityTypeString){
    let dataUrl = this.systemConfig.getServerURL() + "/" + entityTypeString.toLowerCase() + "2";
    return await this.loadData(dataUrl, entityTypeString);
  }

   async loadData(url: string, entityTypeString: string) {
    if(entityTypeString == "locationhierarchylevels")
      entityTypeString = "locationHierarchies";

    const headers = new HttpHeaders().set('Authorization',
      "Basic " + btoa(this.systemConfig.getDefaultUser() + ":" + this.systemConfig.getDefaultPassword()));

    headers.append('Content-Type', "application/json");
    let entity: any[] = [];
    let timestamp = null;

    await this.http.get(url, {headers}).toPromise().then((data) => {
      entity = data[entityTypeString];
      timestamp = data['timestamp'];
    }).catch((err)  => {
      throw err;
    });

    entity.forEach(x => {
      x.clientInsert = timestamp;
      x.processed = true;
      x.syncedWithServer = true;  //Any new records from the server are up to date.
    });

    localStorage.setItem((entityTypeString + "SyncTime"), timestamp);

    return entity;
  }
}
