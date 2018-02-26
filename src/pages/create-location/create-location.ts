import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {Location} from "../../providers/locations/locations-db";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SystemConfigProvider} from "../../providers/system-config/system-config";

/**
 * Generated class for the CreateLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-location',
  templateUrl: 'create-location.html',
})
export class CreateLocationPage {

  edit: boolean;
  errorFix: boolean;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public locProvider: LocationsProvider,
              public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider, public sysConfig: SystemConfigProvider) {
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


  //Dismiss the modal. Pass back the created or fixed location.
  popView() {
    this.locProvider.saveData(this.loc);
    console.log(this.loc);
    this.navCtrl.pop();
  }
}
