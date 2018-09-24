import { Component, OnInit } from '@angular/core';
import {HelpPopoverComponent} from "../../../components/help-popover/help-popover.component";
import {CensusIndividualFormGroup} from "../../../census-forms/individual-form";
import {SocialGroup} from "../../../models/social-group";
import {Location} from "../../../models/location";
import {Individual} from "../../../models/individual";
import {SynchonizationObservableService} from "../../../services/SynchonizationObserverable/synchonization-observable.service";
import {NavigationService} from "../../../services/NavigationService/navigation.service";
import {IndividualService} from "../../../services/IndividualService/individual.service";
import {NetworkConfigurationService} from "../../../services/NetworkService/network-config";
import {ModalController} from "@ionic/angular";
import {AuthService} from "../../../services/AuthService/auth.service";
import {CensusSubmissionService} from "../../../services/CensusSubmissionService/census-submission.service";
import {FieldworkerService} from "../../../services/FieldworkerService/fieldworker.service";
import {CensusIndividual} from "../../../models/census-individual";
import {Router} from "@angular/router";

@Component({
  selector: 'create-individual',
  templateUrl: './create-individual.page.html',
  styleUrls: ['./create-individual.page.scss'],
})
export class CreateIndividualPage implements OnInit {
  readonly PAGE_NAME = "Create a Individual";
  createHead: boolean;
  formSubmitted: boolean = false;
  individualForm: CensusIndividualFormGroup;
  sg: SocialGroup;
  loc: Location;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  individual: Individual = new Individual();

  constructor(public syncObserver: SynchonizationObservableService,public navService: NavigationService,
              public individualProvider: IndividualService, public netConfig: NetworkConfigurationService,
              public modalCtrl: ModalController, public router: Router,
              public authService: AuthService, public censusSub: CensusSubmissionService,
              public fieldworkerProvider: FieldworkerService) {


    this.sg = this.navService.data.sg;
    this.loc = this.navService.data.loc;

    this.individual.collectedBy = this.navService.data.collectedBy;
    this.individualForm = new CensusIndividualFormGroup();
    if (this.navService.data.createHead) {
      this.createHead = true;
    } else {
      this.createHead = false;
    }
  }

  async submitForm(form) {
    this.formSubmitted = true;
    if (form.valid) {
      Object.keys(form.value).forEach((key, index) => {
        this.individual[key] = form.value[key];
      });

      this.formSubmitted = false;
      await this.individualProvider.saveDataLocally(this.individual);
      await this.createAndSaveCensusIndividual();

      this.goBackToCensus();
    }
  }

  async goBackToCensus(){
    if (this.createHead)
      this.syncObserver.publishChange('Create:Individual:GroupHead', {ind: this.individual, head: false});
    else
      this.syncObserver.publishChange('Individual:Create:Success', {ind: this.individual, head: false});
    this.router.navigate(["/baseline"])
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

    let fieldworker = await this.fieldworkerProvider.getFieldworker(this.individual.collectedBy);
    censusInd.collectedBy = fieldworker[0];
    censusInd.individual.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    await this.censusSub.saveCensusInformationForApproval(censusInd);
  }


  async helpPopup(labelName){
    let helpMessage = this.individualForm.getFormHelpMessage(labelName);
    this.navService.data.helpMessage = helpMessage;
    this.navService.data.label = labelName;
    const modal = await this.modalCtrl.create({
      component: HelpPopoverComponent
    });

    modal.present();
  }

  ngOnInit() {
  }

}
