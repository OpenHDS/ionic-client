import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {SocialGroup} from "../../providers/social-group/socialGroup-db";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
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
export class CreateSocialGroupPage {

  edit: boolean;
  geoloc: boolean = false;
  errorFix: boolean;
  sgForm: FormGroup;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  sg: SocialGroup = {
    uuid: null,
    extId: null,
    groupName: null,
    groupType: null,
    groupHead: null,
    collectedBy: null,
    deleted: null,
    insertDate: null,
    clientInsert: null,
    processed: 0,
    selected: false
  };

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder, public sgProvider: SocialGroupProvider,
              public viewCtrl: ViewController, private geo: Geolocation, public netConfig: NetworkConfigProvider,
              public sysConfig: SystemConfigProvider) {


   this.sgForm = formBuilder.group({
   });

    //Determine if error is being fixed.
    this.errorFix = this.navParams.get('fixError');

    if(this.errorFix){
      //If error being fixed, set the location for the modal to the location being fixed.
      this.sg = this.navParams.get("socialGrp");

    }
  }


  //Dismiss the modal. Pass back the created or fixed location.
  //TODO: Prevent popping of page if form has errors.
  async popView() {
    await this.sgProvider.saveDataLocally(this.sg);
    await this.publishCreationEvent();
    this.navCtrl.pop()
  }

  publishCreationEvent(){
    this.ev.publish('submitLocation', true);
  }


}
