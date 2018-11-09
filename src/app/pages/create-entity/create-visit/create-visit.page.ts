import { Component, OnInit } from '@angular/core';
import {Fieldworker} from "../../../models/fieldworker";
import {Location} from "../../../models/location";
import {VisitFormControl, VisitFormGroup} from "../../../census-forms/visit-form";
import {Visit} from "../../../models/visit";
import {SynchonizationObservableService} from "../../../services/SynchonizationObserverable/synchonization-observable.service";
import {NavigationService} from "../../../services/NavigationService/navigation.service";
import {VisitService} from "../../../services/VisitService/visit.service";
import {NetworkConfigurationService} from "../../../services/NetworkService/network-config";
import {AuthService} from "../../../services/AuthService/auth.service";
import {ModalController, NavController} from "@ionic/angular";
import {HelpPopoverComponent} from "../../../components/help-popover/help-popover.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'create-visit',
  templateUrl: './create-visit.page.html',
  styleUrls: ['./create-visit.page.scss'],
})
export class CreateVisitPage implements OnInit {
  readonly PAGE_NAME = 'Create a Visit';
  collectedBy: Fieldworker;
  visitLocation: Location;
  visitForm: VisitFormGroup;
  formSubmitted: boolean = false;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  visit: Visit = new Visit();

  constructor(public syncObserver: SynchonizationObservableService, public navParams: NavigationService, public navController: NavController,
              public visitProvider: VisitService, public netConfig: NetworkConfigurationService, public modalController: ModalController,
              public authProvider: AuthService) {

    this.syncObserver.subscribe("Baseline:CreateVisit", () => {
      console.log("Baseline Census: Create a Visit");
    });

    //Set fields that are passed from parent, and aren't filled in by fieldworker.
    this.visit.visitLocation = this.navParams.data["visitLocation"].extId;
    this.visit.collectedBy =  this.navParams.data["collectedBy"];

    this.visitForm = new VisitFormGroup();

    this.visitForm.setValue({
      collectedBy: this.navParams.data.collectedBy,
      visitLocation: this.navParams.data.visitLocation,

      extId: '',
      visitDate: '',
      realVisit: '',
      roundNumber: 0

    })
  }

  ngOnInit(){

  }

  ionViewWillEnter() {
  }

  async submitForm(form){
    this.formSubmitted = true;
    if(form.valid){
      Object.keys(form.value).forEach((key, index) => {
        this.visit[key] = form.value[key];
        console.log(this.visit[key] + " " + form.value[key])
      });

      this.visit.visitLocation = this.navParams.data["visitLocation"];
      this.visit.collectedBy =  this.navParams.data["collectedBy"];
      this.visit.roundNumber = 0;

      this.visitProvider.saveDataLocally(this.visit);
      this.formSubmitted = false;

      this.goBackToCensus();
    }
  }

  goBackToCensus(){
    this.syncObserver.publishChange("Visit:Create:Success", this.visit);
    this.navController.navigateBack("/baseline");
  }

  async helpPopup(labelName:string){
    let helpMessage = this.visitForm.getFormHelpMessage(labelName);
    this.navParams.data = {label: labelName, helpMessage: helpMessage};
    const modal = await this.modalController.create({
      component: HelpPopoverComponent
    });

    return await modal.present();
  }
}
