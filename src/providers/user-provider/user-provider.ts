import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Bcrypt from "bcryptjs";
import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {Fieldworker} from "../../interfaces/fieldworker";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: HttpClient, public fieldworkerProvider: FieldworkerProvider) {
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
  }

  setUserLogout(){
    localStorage.setItem("loggedInUser", null);
    localStorage.setItem("hasLoggedIn", Boolean(false).toString());
  }

  getLoggedInUser(){
    return localStorage.getItem("loggedInUser");
  }
}
