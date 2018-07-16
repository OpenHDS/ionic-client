import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {Location} from "../../interfaces/locations";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {LocationFormControl, LocationFormGroup} from "../../census-forms/location-form";

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

  geoloc: boolean = false;
  errorFix: boolean;
  formSubmitted: boolean = false;
  form: LocationFormGroup;

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
    processed: false,
    selected: false
  };

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public locProvider: LocationsProvider, public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider,
              public sysConfig: SystemConfigProvider, public user: UserProvider) {

    this.loc.collectedBy = this.user.getLoggedInUser();
    this.loc.locationLevel = this.navParams.get("parentLevel").extId
    this.form = new LocationFormGroup();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  getGeolocationInfo(){
    let loading = this.loadingCtrl.create({
      content: "Gathering geolocation information..."
    });

    loading.present();

    this.geo.getCurrentPosition().then((resp) => {
      this.loc.latitude = resp.coords.latitude;
      this.loc.longitude = resp.coords.longitude;
      this.loc.altitude = resp.coords.altitude;
      this.loc.accuracy = resp.coords.altitudeAccuracy;
    }).catch(err => console.log(err)).then(() => {
      this.geoloc = true;
      loading.dismiss();
    });
  }

  async submitForm(form: NgForm){
    this.formSubmitted = true;
    if(form.valid){
      this.locProvider.saveDataLocally(this.loc);
      form.reset();
      this.formSubmitted = false;
      await this.publishCreationEvent();
    }
  }

  //Dismiss the modal. Pass back the created or fixed location.
  async dismissForm() {
    this.navCtrl.pop()
  }

  publishCreationEvent(){
    this.ev.publish('submitLocation', true);
  }

}
