import { Component, OnInit } from '@angular/core';
import {HelpPopoverComponent} from "../../../components/help-popover/help-popover.component";
import {SocialGroup} from "../../../models/social-group";
import {SocialGroupFormGroup} from "../../../census-forms/social-group-form";
import {SynchonizationObservableService} from "../../../services/SynchonizationObserverable/synchonization-observable.service";
import {SocialGroupService} from "../../../services/SocialGroupService/social-group.service";
import {NetworkConfigurationService} from "../../../services/NetworkService/network-config";
import {ModalController} from "@ionic/angular";
import {AuthService} from "../../../services/AuthService/auth.service";
import {NavigationService} from "../../../services/NavigationService/navigation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'create-social-group',
  templateUrl: './create-social-group.page.html',
  styleUrls: ['./create-social-group.page.scss'],
})
export class CreateSocialGroupPage implements OnInit {
  readonly PAGE_NAME = "Create a Social Group";

  formSubmitted: boolean = false;
  sgForm: SocialGroupFormGroup;
  lookupSGHead: boolean = false;

  socialGroup: SocialGroup = new SocialGroup();
  constructor(public syncObserver: SynchonizationObservableService,  public navService: NavigationService, public router: Router,
              public sgProvider: SocialGroupService, public netConfig: NetworkConfigurationService, public modalController: ModalController,
              public authService: AuthService) {

    this.sgForm = new SocialGroupFormGroup();

    this.socialGroup.collectedBy = this.navService.data.collectedBy;

    this.syncObserver.subscribe("Baseline:CreateSocialGroup", () => {
      console.log("Baseline Census: Create a Social Group");
    });

    this.syncObserver.subscribe("Create:Individual:GroupHead", async (ind) => {
      this.socialGroup.groupHead = ind.ind;
      this.sgProvider.saveDataLocally(this.socialGroup);
      this.goBackToCensus(this.socialGroup);
    });

    this.syncObserver.subscribe("Search:SocialGroup:Head", async (individual) => {
      this.socialGroup.groupHead = individual;
      this.lookupSGHead = false;
      this.sgProvider.saveDataLocally(this.socialGroup);
      this.goBackToCensus(this.socialGroup);
    });
  }


  //Dismiss the modal. Note: Data is not saved if the form is not completed!
  async dismissForm() {
    this.router.navigate(["/baseline"]);
  }

  async submitForm(form){

    this.formSubmitted = true;
    if(form.valid){
      Object.keys(form.value).forEach((key, index) => {
        this.socialGroup[key] = form.value[key];
      });

      this.formSubmitted = false;
      console.log(this.lookupSGHead);
      if(this.lookupSGHead)
        this.lookupHead();
      else
        this.createHead();
    }
  }

  setHeadLookup(){
    console.log("Head lookup");
    this.lookupSGHead = true;
  }

  async goBackToCensus(socialGroup: SocialGroup){
    this.syncObserver.publishChange("SocialGroup:Create:Success", socialGroup);
    this.syncObserver.publishChange("SocialGroup:Create:ListUpdate");
    this.router.navigate(["/baseline"])
  }

  async createHead(){
    this.navService.data.collectedBy = this.navService.data.collectedBy;
    this.navService.data.socialGroupLocation = this.navService.data.location;
    this.navService.data.socialGroup = this.socialGroup;
    this.router.navigate(['/create-individual']);
  }

  async lookupHead(){
    this.navService.data.entity = 'individuals';
    this.navService.data.headLookup = true;
    this.router.navigate(["/search"]);
  }

  async helpPopup(labelName){
    let helpMessage = this.sgForm.getFormHelpMessage(labelName);
    this.navService.data = {label: labelName, helpMessage: helpMessage};
    const modal = await this.modalController.create({
      component: HelpPopoverComponent
    });

    return await modal.present();
  }

  ngOnInit() {
  }

}
