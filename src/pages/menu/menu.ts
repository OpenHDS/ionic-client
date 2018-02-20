import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ErrorDisplayPage} from "../error-display/error-display";
import {SystemConfigPage} from "../system-config/system-config";

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
export class MenuPage {

  constructor(public viewCtrl: ViewController, public navController: NavController) {
  }

  goToErrorsPage(){
    this.navController.push(ErrorDisplayPage).then(() => this.close());
  }

  goToSystemSettings(){
    this.navController.push(SystemConfigPage).then(() => this.close());
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
