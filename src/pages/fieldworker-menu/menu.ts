import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ErrorDisplayPage} from "../error-display/error-display";
import {SystemConfigPage} from "../system-config/system-config";
import {SupervisorModePage} from "../supervisor-mode/supervisor-mode";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {LoginPage} from "../login/login";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class FieldworkerMenuPage {

  constructor(public viewCtrl: ViewController, public navController: NavController, public user: UserProvider) {
  }

  goToErrorsPage(){
    this.navController.push(ErrorDisplayPage).then(() => this.close());
  }

  goToSystemSettings(){
    this.navController.push(SystemConfigPage).then(() => this.close());
  }

  switchToSuper(){
    //Pop all fieldworker views, and push the supervisor view.
    this.navController.pop()
      .then(() => this.navController.push(SupervisorModePage)
        .then(() => this.close()));

  }

  logoutUser(){
    this.user.setUserLogout();
    this.navController.popAll();
    this.navController.setRoot(LoginPage);
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
