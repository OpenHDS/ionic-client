import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Fieldworker} from "../../model/fieldworker";
import {User} from "../../model/user";
import {UserProvider} from "../user-provider/user-provider";
import Bcrypt from "bcryptjs";
import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {MenuController} from "ionic-angular";


/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on services
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  loggedInSupervisor: User;
  loggedInFieldworker: Fieldworker;
  isUserLoggedIn: boolean = false;

  constructor(public http: HttpClient, public userProvider: UserProvider,
              public fieldworkerProvider: FieldworkerProvider, public menu: MenuController) {
    console.log('Hello AuthProvider Provider');
  }

  async login(username, password, supervisor?) {

    if(supervisor){
      let user = await this.userProvider.loadSupervisorUser(username, password);
      if(user.length === 0 || !Bcrypt.compareSync(password, user[0].password))
        return false;

      this.loggedInSupervisor = user[0];
      this.isUserLoggedIn = true;
      return true;
    }

    let fieldworker = await this.fieldworkerProvider.getFieldworker(username);
    if (fieldworker.length === 0 || !Bcrypt.compareSync(password, fieldworker[0].passwordHash))
      return false;

    this.loggedInFieldworker = fieldworker[0];
    return true;
  }

  setMenu(){
    if(this.isUserLoggedIn){
      this.menu.enable(true, "adminMenu");
    } else {
      this.menu.enable(true, "fieldworkerMenu")
    }
  }

  disableMenu(){
    if(this.isUserLoggedIn) {
      this.menu.enable(false, "adminMenu");
    } else {
      this.menu.enable(false, "fieldworkerMenu");
    }
  }

  logout(){
    if(this.isUserLoggedIn){
      this.loggedInSupervisor = undefined;
    } else {
      this.loggedInFieldworker = undefined;
    }
  }

  getLoggedInUser(){
    return this.loggedInSupervisor;
  }

  getLoggedInFieldworker(){
    return this.loggedInFieldworker;
  }

  hasFieldworkerLoggedIn(){
   return this.loggedInFieldworker != undefined;
  }

  hasSupervisorLoggedIn(){
    return this.loggedInSupervisor != undefined;
  }

  canAccess(){

  }
}
