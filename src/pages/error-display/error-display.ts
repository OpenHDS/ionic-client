import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ErrorsProvider} from "../../services/errors/errors";
import {DataError} from "../../model/data-errors"
import {LocationsProvider} from "../../services/locations/locations-provider";

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
  locationErrors: Promise<DataError[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public errorProvider: ErrorsProvider, public modalCtrl: ModalController, public locProvider: LocationsProvider) {
    this.getLocationErrors().then(() => console.log("Location errors loaded"));
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  async getLocationErrors(){
    this.locationErrors = this.errorProvider.getLocationErrors()
  }

  convertTimestampToDate(timestamp: number){
    return new Date(timestamp).toString();
  }


  //
  // //Fix errors that occur with creation or saving of a location.
  // fixLocationErrors(locError: Errors){
  //   const createPage = this.modalCtrl.create(CreateLocationPage, {fixError: true, location: locError.entity});
  //   createPage.present();
  //
  //   createPage.onDidDismiss(data => {
  //     if(data != null) {
  //       locError.entity = data.loc;
  //     }
  //   });
  // }

  // getEntityModal(error){
  //   if(error.entityType === EntityErrorLabels.LOCATION_ERROR)
  //     this.fixLocationErrors(error);
  // }
}
