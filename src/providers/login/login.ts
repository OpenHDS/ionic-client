import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events, MenuController} from "ionic-angular";
import {NetworkConfigProvider} from "../network-config/network-config";
import Bcrypt from "bcryptjs";

import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {UserProvider} from "../user-provider/user-provider";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {


  constructor(public http: HttpClient, public events: Events, public fieldworkerProvider: FieldworkerProvider,
              public menu: MenuController, public networkConfig: NetworkConfigProvider, public userProvider: UserProvider) {

    console.log('Hello LoginProvider Provider');

  }

  async checkPassword(username, password, supervisor?) {
    let status = false;

    if(supervisor){
      let user = await this.userProvider.loadSupervisorUser(username, password);

      if(user.length === 0)
        return false;

      return Bcrypt.compareSync(password, user[0].password);
    }

    let fieldworker = await this.fieldworkerProvider.getFieldworker(username);
    if (fieldworker.length === 0)
      return status;

    return Bcrypt.compareSync(password, fieldworker[0].passwordHash);
  }

  setLoggedInUser(username){
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("hasLoggedIn", Boolean(true).toString());
    localStorage.setItem("loggedInTime", Date.now().toString());
    this.enableUserMenu()
  }

  setUserLogout(){
    localStorage.setItem("loggedInUser", null);
    localStorage.setItem("hasLoggedIn", Boolean(false).toString());
    this.disableUserMenu();
  }

  hasLoggedIn(){
    let loggedIn = localStorage.getItem("hasLoggedIn");
    return loggedIn != null && loggedIn.toLowerCase() == 'true' ? true : false; //returns true if logged in, false otherwise
  }

  getLoggedInUser(){
    return localStorage.getItem("loggedInUser");
  }

  enableUserMenu(){
    if(this.getLoggedInUser() === 'admin') {
      this.menu.enable(true, "adminMenu");

      console.log("ENABLING ADMIN")
    }
    else {
      this.menu.enable(true, "fieldworkerMenu");
      console.log("ENABLING FIELDWORKER")
    }
  }

  disableUserMenu(){
    if(this.getLoggedInUser() == "admin") {
      this.menu.enable(false, "adminMenu");

      console.log("DISABLING ADMIN")
    }
    else {
      this.menu.enable(false, "fieldworkerMenu");

      console.log("DISABLING FIELDWORKER")
    }
  }
}
