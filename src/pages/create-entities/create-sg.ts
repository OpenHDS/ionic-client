import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {SocialGroup} from "../../interfaces/social-groups";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {CreateIndividualPage} from "./create-individual";
import {UserProvider} from "../../providers/user-provider/user-provider";

/**
 * Generated class for the CreateLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'create-social-group',
  templateUrl: 'create-sg.html',
})
export class CreateSocialGroupPage {

  edit: boolean;
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
              public formBuilder: FormBuilder, public sgProvider: SocialGroupProvider, public netConfig: NetworkConfigProvider,
              public sysConfig: SystemConfigProvider, public user: UserProvider) {


   this.sgForm = formBuilder.group({
     name: ['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
     extId:['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
     type: ['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
   });

    //Determine if error is being fixed.
    this.errorFix = this.navParams.get('fixError');

    if(this.errorFix){
      //If error being fixed, set the location for the modal to the location being fixed.
      this.sg = this.navParams.get("socialGrp");
    }

    this.ev.subscribe("submitHeadIndividual", (ind) => {
      console.log("SOCIAL GROUP" + ind.ind);
      this.sg.groupHead = ind.ind;
      this.popView();
    })
  }


  //Dismiss the modal. Pass back the created or fixed location.
  //TODO: Prevent popping of page if form has errors.
  async popView() {
    await this.sgProvider.saveDataLocally(this.sg);
    await this.publishCreationEvent();
    this.navCtrl.pop()
  }

  async createHead(){
    await this.navCtrl.push(CreateIndividualPage, {sg: this.sg, createHead: true});
  }

  publishCreationEvent(){
    this.ev.publish('submitSG', {sg: this.sg, reload: true});
  }
}
