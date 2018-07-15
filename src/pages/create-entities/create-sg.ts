import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {SocialGroup} from "../../interfaces/social-groups";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {FormBuilder,  NgForm} from "@angular/forms";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {CreateIndividualPage} from "./create-individual";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {SocialGroupFormGroup} from "../../census-forms/social-group-form";

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

  formSubmitted: boolean = false;
  sgForm: SocialGroupFormGroup;

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

  constructor(public ev: Events, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder, public sgProvider: SocialGroupProvider, public netConfig: NetworkConfigProvider,
              public sysConfig: SystemConfigProvider, public user: UserProvider) {


   this.sgForm = new SocialGroupFormGroup(this.user.getLoggedInUser(), this.navParams.get('sgLocation').extId);


    this.ev.subscribe("submitHeadIndividual", (ind) => {
      this.sg.groupHead = ind.ind;

    })
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }


  //Dismiss the modal. Note: Data is not saved if the form is not completed!
  async dismissForm() {
    this.navCtrl.pop()
  }

  async submitForm(form: NgForm){
    this.formSubmitted = true;
    if(form.valid){
      this.formSubmitted = false;
      await this.createHead().then(async () => {
        await this.sgProvider.saveDataLocally(this.sg);
        await this.publishCreationEvent();
        form.reset();
        this.formSubmitted = false;
      });
    }
  }

  async createHead(){
    await this.navCtrl.push(CreateIndividualPage, {sg: this.sg, createHead: true});
  }

  publishCreationEvent(){
    this.ev.publish('submitSG', {sg: this.sg, reload: true});
  }
}
