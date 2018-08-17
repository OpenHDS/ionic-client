import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import {
  IonicPage,
  Events,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  PopoverController
} from 'ionic-angular';

import {Geolocation} from "@ionic-native/geolocation";
import {Location} from "../../interfaces/locations";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {LocationFormGroup} from "../../census-forms/location-form";

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
  loc: Location = new Location();
  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public locProvider: LocationsProvider, public viewCtrl: ViewController, private geo: Geolocation,
              public netConfig: NetworkConfigProvider, public popoverCtrl: PopoverController,
              public sysConfig: SystemConfigProvider, public user: UserProvider) {

    this.loc.collectedBy = this.user.getLoggedInUser();
    this.loc.locationLevel = this.navParams.get("parentLevel").extId;
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
      this.loc.locationLevel = this.navParams.get("parentLevel");
      await this.locProvider.saveDataLocally(this.loc);
      this.formSubmitted = false;
      await this.publishCreationEvent();
      this.dismissForm();
    }
  }

  //Dismiss the modal. Pass back the created or fixed location.
  async dismissForm() {
    this.navCtrl.pop()
  }

  publishCreationEvent(){
    this.ev.publish('submitLocation', true);
  }

  helpPopup(labelName){
    let helpMessage = this.form.getFormHelpMessage(labelName);
    const popover = this.popoverCtrl.create(LocationPopoverHelp,
      {label: labelName, message: helpMessage});

    popover.present();
  }

}



@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Help: {{this.labelName}} </ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-item>Valid inputs for this field are:</ion-item>
        <ion-list>
          <ion-item *ngFor="let message of this.helpMessage">
            {{message}}
          </ion-item>
        </ion-list>
    </ion-content>
  `
})

export class LocationPopoverHelp{
  labelName: string;
  helpMessage;
  constructor(public navParams: NavParams){
    this.labelName = this.navParams.get("label");
    this.helpMessage = this.navParams.data["message"];
  }
}
