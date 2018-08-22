import {Component} from '@angular/core';
import {
  IonicPage,
  Events,
  NavController,
  NavParams,
  ViewController,
  PopoverController
} from 'ionic-angular';
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {NgForm} from "@angular/forms";
import {Individual} from "../../model/individual";
import {IndividualProvider} from "../../providers/individual/individual";
import {SocialGroup} from "../../model/social-groups";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {Location} from "../../model/locations";
import {FieldworkerProvider} from "../../providers/fieldworker/fieldworker";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {CensusIndividualFormGroup} from "../../census-forms/individual-form";
import {CensusIndividual} from "../../model/census-individual";

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
  createHead: boolean;
  formSubmitted: boolean = false;
  individualForm: CensusIndividualFormGroup;
  sg: SocialGroup;
  loc: Location;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  individual: Individual = new Individual();

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public view: ViewController,
              public individualProvider: IndividualProvider, public netConfig: NetworkConfigProvider, public popoverCtrl: PopoverController,
              public user: UserProvider, public fieldProvider: FieldworkerProvider, public censusSub: CensusSubmissionProvider) {


    this.sg = this.navParams.data["sg"];
    this.loc = this.navParams.data["loc"];

    this.individualForm = new CensusIndividualFormGroup();
    this.individual.collectedBy = this.user.getLoggedInUser();
    if (this.navParams.get('createHead')) {
      this.createHead = true;
    } else {
      this.createHead = false;
    }
  }

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  async submitForm(form: NgForm) {
    this.formSubmitted = true;
    if (form.valid) {
      this.formSubmitted = false;
      await this.individualProvider.saveDataLocally(this.individual);
      await this.createAndSaveCensusIndividual();
        if (this.createHead)
          await this.publishHeadCreationEvent();
        else
          await this.publishIndividualCreation();

        this.dismissForm();
    }
  }

  async createAndSaveCensusIndividual() {
    var censusInd = new CensusIndividual();
    censusInd.uuid = this.individual.uuid;
    censusInd.locationExtId = this.loc.extId;
    censusInd.socialGroupExtId = this.sg.extId;
    if(this.createHead)
      censusInd.socialGroupHeadExtId = this.individual.extId;
    else
      censusInd.socialGroupHeadExtId= this.sg.groupHead.extId;
    censusInd.individual = await this.individualProvider.shallowCopy(this.individual);
    censusInd.bIsToA= this.individual.bIsToA;
    censusInd.spouse = this.individual.spouse != undefined ? await this.individualProvider.findIndividualByExtId(this.individual.spouse) : null;

    let fieldworker = await this.fieldProvider.getFieldworker(this.user.getLoggedInUser());
    censusInd.collectedBy = fieldworker[0].extId;
    censusInd.individual.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    await this.censusSub.saveCensusInformationForApproval(censusInd);
  }

  async dismissForm(){
    this.navCtrl.pop()
  }

  async publishHeadCreationEvent() {
    this.ev.publish('submitHeadIndividual', {ind: this.individual, head: false});
  }

  async publishIndividualCreation() {
    this.ev.publish('submitIndividual', {ind: this.individual, head: false});
  }

  helpPopup(labelName){
    let helpMessage = this.individualForm.getFormHelpMessage(labelName);
    const popover = this.popoverCtrl.create(IndividualPopoverHelp,
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

export class IndividualPopoverHelp{
  labelName: string
  helpMessage;
  constructor(public navParams: NavParams){
    this.labelName = this.navParams.get("label");
    this.helpMessage = this.navParams.data["message"];
  }
}
