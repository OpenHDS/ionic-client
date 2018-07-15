import {Component} from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {NgForm} from "@angular/forms";
import {Individual} from "../../interfaces/individual";
import {IndividualProvider} from "../../providers/individual/individual";
import {SocialGroup} from "../../interfaces/social-groups";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {Location} from "../../interfaces/locations";
import {FieldworkerProvider} from "../../providers/fieldworker/fieldworker";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {CensusIndividualFormGroup} from "../../census-forms/individual-form";

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
              public individualProvider: IndividualProvider, public netConfig: NetworkConfigProvider,
              public user: UserProvider, public fieldProvider: FieldworkerProvider, public censusSub: CensusSubmissionProvider) {

    this.sg = this.navParams.data["sg"];

    this.loc = this.navParams.data["loc"];

    this.individualForm = new CensusIndividualFormGroup(this.user.getLoggedInUser(), this.sg.extId);

    if (this.navParams.get('createHead')) {
      this.createHead = true;
    } else {
      this.createHead = false;
    }
  }

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  async submitForm(form: NgForm){
    this.formSubmitted = true;
    if(form.valid){
    }
  }

  //Dismiss the modal. Pass back the created or fixed location.
  //TODO: Prevent popping of page if form has errors.
  async popView() {
    //Set fieldworker and save individual locally
    await this.fieldProvider.getFieldworker(localStorage.getItem("loggedInUser")).then(x => this.individual.collectedBy = x[0]);
    await this.individualProvider.saveDataLocally(this.individual);

    //After saving individual locally, create a census individual submission for server approval.
    var censusInd = {};
    censusInd["uuid"] = this.individual.uuid;
    censusInd["locationExtId"] = this.loc.extId;
    censusInd["socialGroupExtId"] = this.sg.extId;
    censusInd["socialGroupHeadExtId"] = this.sg.groupHead.extId;
    censusInd["individual"] = this.individual;
    censusInd["bIsToA"] = this.individual.bIsToA;

    censusInd["spouse"] =  this.individual.spouse != undefined ? await this.individualProvider.findIndividualByExtId(this.individual.spouse): null;
    censusInd["collectedBy"] = {extId: this.individual.collectedBy.extId, "uuid": this.individual.collectedBy.uuid};
    await this.censusSub.saveCensusInformationForApproval(censusInd);
    if(this.createHead)
      await this.publishHeadCreationEvent();
    else
      await this.publishIndividualCreation();

    this.navCtrl.pop()
  }

  async publishHeadCreationEvent(){
    this.ev.publish('submitHeadIndividual', {ind: this.individual, head: false});
  }

  async publishIndividualCreation(){
    this.ev.publish('submitIndividual', {ind: this.individual, head: false});
  }
}
