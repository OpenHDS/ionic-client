import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events, MenuController} from '@ionic/angular';
import {User} from '../../models/user';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {SystemConfigService} from '../SystemService/system-config.service';
import {NetworkConfigurationService} from '../NetworkService/network-config';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class UserService {
  db: OpenhdsDb;
  constructor(public http: HttpClient, public events: Events, public menu: MenuController,
              public networkConfig: NetworkConfigurationService, public systemConfigProvider: SystemConfigService) {
    this.db = new OpenhdsDb();
  }

  async loadSupervisorUser(username, password) {
    const headers = new HttpHeaders().set('Authorization',
      'Basic ' + btoa(username + ':' + password));

    const user = new User();
    headers.append('Content-Type', 'application/json');
    if (this.networkConfig.isConnected()) {
      await this.http.get(this.systemConfigProvider.getServerURL() + '/users2/' + username,  {headers}).toPromise().then(
        (userInfo) => {
          console.log(userInfo['username']);
          user.uuid = userInfo['uuid'];
          user.username = userInfo['username'];
          user.password = userInfo['password'];
          user.roles = userInfo['roles'];
          console.log(userInfo);

          // Clear cache and replace with new user
          this.db.userCache.clear();
          this.db.userCache.add(user);
        }).catch(err => err);

      return await this.db.userCache.where('username').equals(username).toArray();
    }

    // No network connection, or lookup on server failed... See if stored in local database.
    return await this.db.userCache.where('username').equals(username).toArray();





  }
}
