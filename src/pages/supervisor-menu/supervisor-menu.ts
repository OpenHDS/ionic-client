import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ErrorDisplayPage} from "../error-display/error-display";
import {SystemConfigPage} from "../system-config/system-config";
import {SupervisorModePage} from "../supervisor-mode/supervisor-mode";
import {BaselineCensusPage} from "../baseline-census/baseline-census";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'supervisor-menu.html',
})
export class SupervisorMenuPage {

  constructor(public viewCtrl: ViewController, public navController: NavController) {
  }

  goToErrorsPage(){
    this.navController.push(ErrorDisplayPage).then(() => this.close());
  }

  goToSystemSettings(){
    this.navController.push(SystemConfigPage).then(() => this.close());
  }

  switchToFieldworker(){
    //Pop all fieldworker views, and push the supervisor view.
    this.navController.popAll()
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
