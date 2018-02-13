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
    sentToServer: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider) {

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
    this.viewCtrl.dismiss({
      loc: this.loc
    });
  }
}
