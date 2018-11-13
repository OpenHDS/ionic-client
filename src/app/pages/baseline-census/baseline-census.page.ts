import { Component, OnInit } from '@angular/core';
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Hierarchy} from "../../models/hierarchy";
import {SocialGroup} from "../../models/social-group";
import {Individual} from "../../models/individual";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";
import {Location} from "../../models/location";
import {AlertController, NavController} from "@ionic/angular";
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";
import {Visit} from "../../models/visit";
import {Router} from "@angular/router";

@Component({
  selector: 'baseline-census',
  templateUrl: './baseline-census.page.html',
  styleUrls: ['./baseline-census.page.scss'],
})

export class BaselineCensusPage implements OnInit {
  readonly PAGE_NAME = 'Baseline Census';
  levels: Array<HierarchyLevel>;
  collectedBy = 'FWFF1';
  selectedHierarchy: Array<Hierarchy>;
  selectedLocation: Location;
  selectedSocialGroup: SocialGroup;
  selectedIndividuals: Array<Individual>;
  selectedVisit: Visit;
  baselineStep = 'hierarchy';
  shownGroup = ['hierarchy'];
  editing = false;
  entityErrors = [];


  constructor(public router: Router,
              public syncObservable: SynchonizationObservableService,
              public locHierarchyService: LocationHierarchyService,
              public navController: NavController,
              public alertCtrl: AlertController,
              public navService: NavigationService) {

    this.syncObservable.subscribe("Location:Create:Success", (location) => {
      this.setSelectedLocation(location);
    });

    this.syncObservable.subscribe("SocialGroup:Create:Success", (socialGroup) => {
      this.setSelectedSocialGroup(socialGroup);
    });

    this.syncObservable.subscribe("Individual:Create:Success", (individual) => {
      this.setSelectedIndividuals(individual.ind);
    });


    this.syncObservable.subscribe("Visit:Create:Success", (visit) => {
      this.selectedVisit = visit;
      this.displayCensusSubmission();
    });

    this.syncObservable.subscribe("Entity:Correction", () => {
      this.displayCorrectionMessage();
    })
  }

  async ngOnInit() {
    this.levels = await this.locHierarchyService.getLevels();
    this.selectedHierarchy = [];
    this.selectedIndividuals = [];
  }

  async ionViewWillEnter(){
    console.log("ionViewWillEnter BaselineCensusPage");
    console.log(this.navService.data);
    if(this.navService.data !== undefined && this.navService.data.editing !== undefined) {
        this.editing = this.navService.data.entityEditing;
        await this.resetBaselineCensus();
        this.processEditing();
    } else {
      this.editing = false;
    }
  }

  setSelectedHierarchy(hierarchy: Hierarchy) {
    this.selectedHierarchy[hierarchy.level.keyIdentifier] = hierarchy;
    this.checkBaselineStepComplete();
  }

  setSelectedLocation(location: Location) {
    this.selectedLocation = location;
    this.checkBaselineStepComplete();
  }

  setSelectedSocialGroup(sg: SocialGroup) {
    this.selectedSocialGroup = sg;
    this.checkBaselineStepComplete();
  }

  setSelectedIndividuals(ind: Individual) {
    console.log(ind);
    this.selectedIndividuals.push(ind);
    this.checkBaselineStepComplete();
  }


  checkBaselineStepComplete() {
    switch (this.baselineStep) {
      case 'hierarchy':
        if (this.selectedHierarchy[this.levels.length] !== undefined) {
          this.moveToNextBaselineStep('location');
        }
        break;
      case 'location':
        if (this.selectedLocation !== undefined) {
          this.moveToNextBaselineStep('socialGroup');
        }
        break;
      case 'socialGroup':
        if (this.selectedSocialGroup !== undefined) {
          this.moveToNextBaselineStep('individual');
        }
        break;
      case 'individual':
       break;
      default: break;
    }
  }

  async goToCreatePage(){
    switch (this.baselineStep) {
      case 'location':
        // If editing set these fields: editing, errors, and location
        if(this.editing){
          this.navService.data["editing"] = true;
          this.navService.data["errors"] = this.entityErrors;
          this.navService.data["location"] = this.selectedLocation;
        } else {
          this.navService.data = {collectedBy: this.collectedBy, parentLevel: this.selectedHierarchy[this.selectedHierarchy.length -1].extId};
        }
        this.navController.navigateForward("/create-location").then(() => {
          this.syncObservable.publishChange("Baseline:CreateLocation");
        });
        break;
      case 'socialGroup':
        if(this.editing){
          this.navService.data["editing"] = true;
          this.navService.data["errors"] = this.entityErrors;
          this.navService.data["location"] = this.selectedLocation;
          this.navService.data["socialGroup"] = this.selectedSocialGroup;
        } else {
          this.navService.data = {collectedBy: this.collectedBy, location: this.selectedLocation};
        }
        this.navController.navigateForward("/create-social-group").then(() => {
          this.syncObservable.publishChange("Baseline:CreateSocialGroup");
        });
        break;
      case 'individual':
        if(this.editing){
          this.navService.data["editing"] = true;
          this.navService.data["errors"] = this.entityErrors;
          this.navService.data["location"] = this.selectedLocation;
          this.navService.data["socialGroup"] = this.selectedSocialGroup;
          this.navService.data["individual"] = this.selectedIndividuals[0];
        } else {
          this.navService.data = {
            collectedBy: this.collectedBy,
            locationExtId: this.selectedLocation.extId,
            socialGroup: this.selectedSocialGroup
          };
        }
        this.navController.navigateForward("/create-individual").then(() => {
          this.syncObservable.publishChange("Baseline:CreateIndividual");
        });
        break;
      default: break;
    }
  }

  moveToNextBaselineStep(step) {
    this.baselineStep = step;
    this.toggleGroup(step);

  }

  isEligableToSubmit(){
    if(this.selectedIndividuals != undefined && this.selectedIndividuals.length >= 1)
      return true;
    else
      return false;
  }


  completeBaselineCensus(){
    this.navService.data = {collectedBy: this.collectedBy, visitLocation: this.selectedLocation.extId};
    this.navController.navigateForward("/create-visit").then(() => {
      this.syncObservable.publishChange("Baseline:CreateVisit")
    });
  }

  // Send reload event to entity list components
  reloadEntityList(){
    switch (this.baselineStep) {
      case 'location':
        this.syncObservable.publishChange("Baseline:Reload:Location");
        break;
      case 'socialGroup':
        this.syncObservable.publishChange("Baseline:Reload:SocialGroup");
        break;
      case 'individual':
        this.syncObservable.publishChange("Baseline:Reload:Individual");
        break;
      default: break;
    }
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = this.shownGroup.filter(function(value, index, arr){
        return value !== group;
      });
    } else {
      this.shownGroup.push(group);
    }
  }

  isGroupShown(group) {
    return this.shownGroup.indexOf(group) > -1;
  }

  async processEditing(){
     console.log("Editing Entity: " + this.navService.data.entity);
     this.selectedHierarchy.push(new Hierarchy(), new Hierarchy()); //Filler for hierarchy root and country level
     this.navService.data.selectedHierarchy.forEach(hier => this.selectedHierarchy.push(hier));
     console.log(this.selectedHierarchy);
     switch(this.navService.data.entity){
       case 'locations':
         console.log(this.navService.data);
         this.selectedLocation = this.navService.data.selectedLocation;
         this.toggleGroup('location');
         this.baselineStep = 'location';
         this.entityErrors = this.navService.data.errors;
         break;
       case 'socialGroups':
         console.log(this.navService.data);
         this.selectedLocation = this.navService.data.selectedLocation;
         this.selectedSocialGroup = this.navService.data.selectedSocialGroup;
         this.entityErrors = this.navService.data.errors;
         this.toggleGroup('socialGroup');
         this.baselineStep = 'socialGroup';
         break;
       case 'individuals':
         this.selectedLocation = this.navService.data.selectedLocation;
         this.selectedSocialGroup = this.navService.data.selectedSocialGroup;
         this.navService.data.selectedIndividuals.forEach(ind => this.selectedIndividuals.push(ind));
         this.entityErrors = this.navService.data.errors;
         this.baselineStep = 'individual';
         this.toggleGroup('individual');
         break;
     }

  }

  async resetBaselineCensus() {
    this.levels = await this.locHierarchyService.getLevels();
    this.editing = false;
    this.selectedHierarchy = [];
    this.selectedLocation = undefined;
    this.selectedSocialGroup = undefined;
    this.selectedIndividuals = [];
    this.selectedVisit = undefined;
    this.baselineStep = 'hierarchy';
    this.shownGroup = ['hierarchy'];
  }

  async displayCensusSubmission(){
      let alert = await this.alertCtrl.create({
        header: "Baseline Submitted",
        subHeader: "Census information was successfully submitted",
        buttons: [{
          text: "Confirm",
          handler: () => {this.resetBaselineCensus()}
        }]
      });

      alert.present();
    }

  async displayCorrectionMessage(){
    let alert = await this.alertCtrl.create({
      header: "Edit Successful",
      subHeader: "Information was successfully edited and saved.",
      buttons: [{
        text: "Confirm",
        handler: () => {this.router.navigate(["/entity-correction"])}
      }]
    });

    alert.present();
  }
}
