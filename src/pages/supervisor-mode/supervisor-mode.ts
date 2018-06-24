import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {LocationsProvider} from "../../providers/locations/locations-provider";

/**
 * Generated class for the SuperviserModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-superviser-mode',
  templateUrl: 'supervisor-mode.html',
})
export class SupervisorModePage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
              public navParams: NavParams, public locProvider: LocationsProvider) {

  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuperviserModePage');
  }


}
