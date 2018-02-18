import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ErrorsProvider} from "../../providers/errors/errors";
import {EntityErrorLabels} from "../../providers/errors/entity-error-labels";
import {Errors} from "../../providers/errors/errors-db";

/**
 * Generated class for the ErrorDisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-error-display',
  templateUrl: 'error-display.html',
})
export class ErrorDisplayPage {
  locationErrors: Promise<Errors[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public errorProvider: ErrorsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorDisplayPage');
  }

  async getLocationErrors(){
    this.locationErrors = this.errorProvider.getLocationErrors()
  }

}
