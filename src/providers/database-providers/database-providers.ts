import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemConfigProvider} from "../system-config/system-config";

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
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

  private async loadData(url: string, entityTypeString: string) {
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
      x.selected = false;
      x.clientInsert = timestamp;
      x.processed = 1;
    });

    return entity;
  }
}
