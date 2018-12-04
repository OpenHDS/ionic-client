import { Component, OnInit } from '@angular/core';
import {Fieldworker} from "../../../models/fieldworker";
import {Location} from "../../../models/location";
import {VisitFormGroup} from "../../../census-forms/visit-form";
import {Visit} from "../../../models/visit";
import {SynchonizationObservableService} from "../../../services/SynchonizationObserverable/synchonization-observable.service";
import {NavigationService} from "../../../services/NavigationService/navigation.service";
import {VisitService} from "../../../services/VisitService/visit.service";
import {NetworkConfigurationService} from "../../../services/NetworkService/network-config";
import {AuthService} from "../../../services/AuthService/auth.service";
import {ModalController, NavController} from "@ionic/angular";
import {HelpPopoverComponent} from "../../../components/help-popover/help-popover.component";
import {Router} from "@angular/router";

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

  constructor(public router: Router, public syncObserver: SynchonizationObservableService, public navParams: NavigationService, public navController: NavController,
              public visitProvider: VisitService, public netConfig: NetworkConfigurationService, public modalController: ModalController,
              public authProvider: AuthService) {

    this.syncObserver.subscribe("Baseline:CreateVisit", () => {
      console.log("Baseline Census: Create a Visit");
    });

    this.visitForm = new VisitFormGroup();


    if(this.navParams.data.editing){
      this.setEditVisitFormValues();
    } else {
      this.visitForm.get('collectedBy').setValue(this.navParams.data.collectedBy);
      this.visitForm.get("visitLocation").setValue(this.navParams.data.visitLocation);
      this.visitForm.get("roundNumber").setValue(0);
    }
  }

  ngOnInit(){

  }

  ionViewWillEnter() {
  }

  setEditVisitFormValues(){
    let individual = this.navParams.data.visit;
    for(let prop in this.visitForm.controls){
      this.visitForm.get(prop).setValue(individual[prop])
    }
  }

  async submitForm(form){
    this.formSubmitted = true;
    if(form.valid){

      if(this.navParams.data.editing){
        this.editVisit();
        return;
      }

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

  async editVisit(){
    for(let prop in this.visitForm.controls){
      if(this.visitForm.get(prop).dirty){
        this.navParams.data.visit[prop] = this.visitForm.get(prop).value;
      }
    }

    this.navParams.data.visit.status = 'U';
    await this.visitProvider.update(this.navParams.data.visit);
    this.formSubmitted = false;
    this.router.navigate(['/entity-correction']);
  }

  goBackToCensus(){
    this.syncObserver.publishChange("Visit:Create:Success", this.visit);
    this.navController.goBack();
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
