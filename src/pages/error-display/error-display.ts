import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ErrorsProvider} from "../../providers/errors/errors";
import {EntityErrorLabels} from "../../providers/errors/entity-error-labels";
import {CreateLocationModalPage} from "../create-location-modal/create-location-modal";

import {Errors} from "../../providers/errors/errors-db";
import {LocationsProvider} from "../../providers/locations/locations-provider";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public errorProvider: ErrorsProvider, public modalCtrl: ModalController, public locProvider: LocationsProvider) {
    this.getLocationErrors().then(() => console.log("Location errors loaded"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorDisplayPage');
  }

  async getLocationErrors(){
    this.locationErrors = this.errorProvider.getLocationErrors()
  }

  convertTimestampToDate(timestamp: number){
    return new Date(timestamp).toString();
  }

  fixLocationErrors(loc: Location){
    const createPage = this.modalCtrl.create(CreateLocationModalPage, {edit: true, location: loc});
    createPage.present();

    createPage.onDidDismiss(data => {
      if(data != null)
        this.locProvider.saveData(data.loc)
    });
  }

  getEntityModal(error){
    if(error.entityType === EntityErrorLabels.LOCATION_ERROR)
      this.fixLocationErrors(error);
  }
}
