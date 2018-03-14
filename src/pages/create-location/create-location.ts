import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {Location} from "../../providers/locations/locations-db";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { SystemConf} from "../../providers/system-config/system-config";

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
  geoloc: boolean = false;
  errorFix: boolean;
  locationForm: FormGroup;
  sysConfig = SystemConf.getInstance();

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

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public locProvider: LocationsProvider,
              public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider) {


   this.locationForm = formBuilder.group({
     name: ['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
     extId:['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
     type: ['', Validators.compose([Validators.required, Validators.pattern("^[^-\\s]*[Rr][Uu][Rr]|^[^-\\s]*[Uu][Rr][Bb]")])],
     latitude:['', Validators.compose([Validators.required, Validators.pattern("(-?(\\d*\\.\\d{1}?\\d*|\\d{1,}))"), Validators.min(-90), Validators.max(90)])],
     longitude:['', Validators.compose([Validators.required, Validators.pattern("(-?(\\d*\\.\\d{1}?\\d*|\\d{1,}))"), Validators.min(-180), Validators.max(180)])],
   });



    //Determine if error is being fixed.
    this.errorFix = this.navParams.get('fixError');

    if(this.errorFix){
      //If error being fixed, set the location for the modal to the location being fixed.
      this.loc = this.navParams.get("location");

    }
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
      this.geoloc = true
      loading.dismiss();
    });
  }


  //Dismiss the modal. Pass back the created or fixed location.
  //TODO: Prevent popping of page if form has errors.
  async popView() {
    await this.locProvider.saveDataLocally(this.loc);
    await this.publishCreationEvent();
    this.navCtrl.pop()
  }

  publishCreationEvent(){
    this.ev.publish('submitLocation', true);
  }


}
