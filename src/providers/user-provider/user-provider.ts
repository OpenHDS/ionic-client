import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events, MenuController} from "ionic-angular";
import {NetworkConfigProvider} from "../network-config/network-config";
import {SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {User} from "../../model/user";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  db: OpenhdsDb;
  constructor(public http: HttpClient, public events: Events, public menu: MenuController,
              public networkConfig: NetworkConfigProvider, public systemConfigProvider: SystemConfigProvider) {
    this.db = new OpenhdsDb();
  }

  async loadSupervisorUser(username, password){
    const headers = new HttpHeaders().set('Authorization',
      "Basic " + btoa(username + ":" + password));

    let user = new User();
    headers.append('Content-Type', "application/json");
    if(this.networkConfig.isConnected()){
      await this.http.get(this.systemConfigProvider.getServerURL() + "/users2/" + username,  {headers}).toPromise().then(
        (userInfo) => {
          console.log(userInfo["username"]);
          user.uuid = userInfo["uuid"];
          user.username = userInfo["username"];
          user.password = userInfo["password"];
          user.roles = userInfo["roles"];
          console.log(userInfo);

          //Clear cache and replace with new user
          this.db.userCache.clear();
          this.db.userCache.add(user);
        }).catch(err => err);

      return await this.db.userCache.where('username').equals(username).toArray();
    }

    //No network connection, or lookup on server failed... See if stored in local database.
    return await this.db.userCache.where('username').equals(username).toArray();





  }
}
