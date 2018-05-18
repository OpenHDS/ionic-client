import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location} from "../../interfaces/locations";
import { NetworkConfigProvider } from "../network-config/network-config";
import { UUID } from "angular2-uuid";
import {Errors} from "../../interfaces/data-errors";
import { ErrorsProvider } from "../errors/errors";
import { EntityErrorLabels } from "../errors/entity-error-labels";
import { SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";

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
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.systemConfig.getDefaultUser() + ":" + this.systemConfig.getDefaultPassword()));

    let entity: any[] = [];
    let timestamp = null;

    await this.http.get(url, {headers}).toPromise().then((data) => {
      entity = data[entityTypeString];
      timestamp = data['timestamp'];
    }).catch((err)  => {
      throw "Error getting data occurred";
    });

    entity.forEach(x => {
      x.selected = false;
      x.clientInsert = timestamp;
      x.processed = 1;
    });

    return entity;
  }
}
