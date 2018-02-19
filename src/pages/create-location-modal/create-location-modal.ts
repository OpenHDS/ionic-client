import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Location } from '../../providers/locations/locations-db'
import { NetworkConfigProvider } from "../../providers/network-config/network-config";
import {Geolocation, GeolocationOptions} from "@ionic-native/geolocation";

/**
 * Generated class for the CreateLocationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-location-modal',
  templateUrl: 'create-location-modal.html',
})
export class CreateLocationModalPage {
  edit: boolean;
  errorFix: boolean;
  loc: Location = {
    uuid: null,
    extId: null,
    locationName: null,
    locationType: null,
    longitude: null,
    latitude: null,
    accuracy: null,
    altitude: null,
    collectedBy: null,
    locationLevel: null,
    deleted: null,
    insertDate: null,
    clientInsert: null,
    processed: 0
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider) {
    //Determine if error is being fixed.
    this.errorFix = this.navParams.get('fixError');

    if(this.errorFix){
      //If error being fixed, set the location for the modal to the location being fixed.
      this.loc = this.navParams.get("location");

    }
  }

  getGeolocationInfo(){
    this.geo.getCurrentPosition().then((resp) => {
      this.loc.latitude = resp.coords.latitude;
      this.loc.longitude = resp.coords.longitude;
      this.loc.altitude = resp.coords.altitude;
      this.loc.accuracy = resp.coords.altitudeAccuracy;
    }).then(() => console.log(this.loc)).catch(err => console.log(err));
  }

  dismiss() {
    console.log(this.loc);
    this.viewCtrl.dismiss({
      loc: this.loc
    });
  }
}
