import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Bcrypt from "bcryptjs";
import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {Events, MenuController} from "ionic-angular";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: HttpClient, public events: Events, public fieldworkerProvider: FieldworkerProvider, public menu: MenuController) {
  }

  async checkPassword(username, password) {
    let status = false;
    let fieldworker = await this.fieldworkerProvider.getFieldworker(username);

    console.log(fieldworker);

    if (fieldworker == undefined || fieldworker == null)
      return status;

    return Bcrypt.compareSync(password, fieldworker[0].passwordHash);
  }

  setLoggedInUser(username){
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("hasLoggedIn", Boolean(true).toString());
    localStorage.setItem("loggedInTime", Date.now().toString())
    this.enableUserMenu()
  }

  setUserLogout(){
    localStorage.setItem("loggedInUser", null);
    localStorage.setItem("hasLoggedIn", Boolean(false).toString());
    this.disableUserMenu();
  }

  hasLoggedIn(){
    console.log((Boolean) (localStorage.getItem("hasLoggedIn")));
    return (Boolean) (localStorage.getItem("hasLoggedIn"));
  }

  getLoggedInUser(){
    return localStorage.getItem("loggedInUser");
  }

  enableUserMenu(){
    if(this.getLoggedInUser() == "admin") {
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
