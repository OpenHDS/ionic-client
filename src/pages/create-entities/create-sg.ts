import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, PopoverController} from 'ionic-angular';
import {NetworkConfigProvider} from "../../services/network-config/network-config";
import {SocialGroup} from "../../model/social-groups";
import {SocialGroupProvider} from "../../services/social-group/social-group";
import {NgForm} from "@angular/forms";
import {CreateIndividualPage} from "./create-individual";
import {SocialGroupFormGroup} from "../../census-forms/social-group-form";
import {SearchEntitiesPage} from "../search/search-by-entity/search-entities";
import {AuthProvider} from "../../services/AuthenticationService/authentication";

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
  lookupSGHead: boolean = false;

  sg: SocialGroup = new SocialGroup();
  constructor(public ev: Events, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,
              public sgProvider: SocialGroupProvider, public netConfig: NetworkConfigProvider, public popoverCtrl: PopoverController,
              public authProvider: AuthProvider) {

   this.sg.collectedBy = this.navParams.data["collectedBy"];
   this.sgForm = new SocialGroupFormGroup();


    this.ev.subscribe("submitHeadIndividual", async (ind) => {
      this.sg.groupHead = ind.ind;
      this.saveFormAndExit()
    })

    this.ev.subscribe("socialGroupHeadSearch", async (individual) => {
      this.sg.groupHead = individual;
      this.saveFormAndExit();
    })
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }


  //Dismiss the modal. Note: Data is not saved if the form is not completed!
  async dismissForm() {
    this.navCtrl.pop()
  }

  async submitForm(form: NgForm) {
    this.formSubmitted = true;
    if (form.valid) {
      this.formSubmitted = false;
      if(this.lookupSGHead == false){
        await this.createHead();
      } else {
        this.lookupHead();
      }
    }
  }

  async saveFormAndExit(){
    await this.sgProvider.saveDataLocally(this.sg);
    await this.publishCreationEvent();
    this.formSubmitted = false;
    this.navCtrl.pop();
  }
  async createHead(){
    await this.navCtrl.push(CreateIndividualPage, {collectedBy: this.navParams.get("collectedBy"), sg: this.sg,
      loc: this.navParams.get("sgLocation"), createHead: true});
  }

  async lookupHead(){
    await this.navCtrl.push(SearchEntitiesPage, {lookup: "individuals", headLookup: true})
  }

  publishCreationEvent(){
    this.ev.publish('submitSG', {sg: this.sg, reload: true});
  }

  helpPopup(labelName){
    let helpMessage = this.sgForm.getFormHelpMessage(labelName);
    const popover = this.popoverCtrl.create(SocialGroupPopoverHelp,
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

export class SocialGroupPopoverHelp{
  labelName: string
  helpMessage;
  constructor(public navParams: NavParams){
    this.labelName = this.navParams.get("label");
    this.helpMessage = this.navParams.data["message"];
  }
}
