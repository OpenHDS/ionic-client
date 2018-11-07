import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigService} from '../SystemService/system-config.service';

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({
    providedIn: 'root',
})export class DatabaseService {

  constructor(public http: HttpClient,
              public systemConfigService: SystemConfigService) {
  }

  async initProvider(entityTypeString) {
    const dataUrl = this.systemConfigService.getServerURL() + '/' + entityTypeString.toLowerCase() + '2';
    return await this.loadData(dataUrl, entityTypeString);
  }

   async loadData(url: string, entityTypeString: string) {
    if (entityTypeString === 'locationhierarchylevels') {
      entityTypeString = 'locationHierarchies';
    }

    const headers = new HttpHeaders().set('Authorization',
      'Basic ' + btoa(this.systemConfigService.getDefaultUser() + ':' + this.systemConfigService.getDefaultPassword()));

    headers.append('Content-Type', 'application/json');
    let entity: any[] = [];
    let timestamp = null;

    await this.http.get(url, {headers}).toPromise().then((data) => {
      entity = data[entityTypeString];
      timestamp = data['timestamp'];
    }).catch((err)  => {
      throw err;
    });

    entity.forEach(x => {
      if(x.hasOwnProperty('collectedBy'))
        x.collectedBy = x.collectedBy.extId;
      x.clientInsert = timestamp;
      x.processed = true;
      x.syncedWithServer = true;  // Any new records from the server are up to date.
    });

    localStorage.setItem((entityTypeString + 'SyncTime'), timestamp);

    return entity;
  }
}
