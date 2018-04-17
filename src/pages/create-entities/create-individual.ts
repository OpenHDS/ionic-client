import { Component } from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {Individual} from "../../providers/individual/individual-db";
import {IndividualProvider} from "../../providers/individual/individual";
import {SocialGroup} from "../../providers/social-group/socialGroup-db";

/**
 * Generated class for the CreateLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'create-individual',
  templateUrl: 'create-individual.html',
})
export class CreateIndividualPage {

  edit: boolean;
  errorFix: boolean;
  createHead: boolean;
  individualForm: FormGroup;
  sg: SocialGroup;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  individual: Individual = {
    extId: null,
    dob: null,
    dobAspect: null,
    firstName: null,
    middleName: null,
    lastName: null,
    gender: null,
    father: null,
    mother: null,
    bIsToA: null,
    collectedBy: {},
    deleted: null,
    insertDate: null,
    clientInsert: null,
    uuid: null,
    processed: null,
    selected: null
  };

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder, public individualProvider: IndividualProvider, public netConfig: NetworkConfigProvider,
              public sysConfig: SystemConfigProvider) {

    if(this.navParams.get('createHead'))
      this.createHead = true;
    else {
      this.createHead = false;
    }

    this.sg = this.navParams.get('indSg');



    this.individualForm = formBuilder.group({
      extId:['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
      middleName: ['', Validators.compose([Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
      dob: ['', Validators.compose([Validators.required])],
      dobAspect: ['', Validators.compose([Validators.required, Validators.min(1),
                    Validators.max(2)])],
      gender: ['', Validators.compose([Validators.required])],
      bIsToA: ['', Validators.compose([Validators.required])]
    });

    //Determine if error is being fixed.
    this.errorFix = this.navParams.get('fixError');

    if(this.errorFix){
      //If error being fixed, set the location for the modal to the location being fixed.
      this.individual = this.navParams.get("individual");
    }
  }

  //Dismiss the modal. Pass back the created or fixed location.
  //TODO: Prevent popping of page if form has errors.
  async popView() {
    await this.individualProvider.saveDataLocally(this.individual);
    if(this.createHead)
      await this.publishHeadCreationEvent();
    else
      await this.publishIndividualCreation();

    this.popView();
  }

  async publishHeadCreationEvent(){
    this.ev.publish('submitHeadIndividual', {ind: this.individual, head: false});
  }

  async publishIndividualCreation(){
    this.ev.publish('submitIndividual', {ind: this.individual, head: false});

  }



}
