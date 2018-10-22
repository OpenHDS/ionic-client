import { Component, OnInit } from '@angular/core';
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Hierarchy} from "../../models/hierarchy";
import {SocialGroup} from "../../models/social-group";
import {Individual} from "../../models/individual";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";
import {Location} from "../../models/location";
import {NavController} from "@ionic/angular";
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";

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
  baselineStep = 'hierarchy';
  shownGroup = ['hierarchy'];
  editing = false;


  constructor(public syncObservable: SynchonizationObservableService, public locHierarchyService: LocationHierarchyService,
              public navController: NavController,
              public navService: NavigationService) {

    this.syncObservable.subscribe("Location:Create:Success", (location) => {
      this.setSelectedLocation(location);
    });

    this.syncObservable.subscribe("SocialGroup:Create:Success", (socialGroup) => {
      this.setSelectedSocialGroup(socialGroup);
    });

    this.syncObservable.subscribe("Individual:Create:Success", (individual) => {
      this.setSelectedSocialGroup(individual);
    });
  }

  async ngOnInit() {
    this.levels = await this.locHierarchyService.getLevels();
    this.selectedHierarchy = [];
    this.selectedIndividuals = [];
    if(this.navService.data !== undefined) {
      this.editing = this.navService.data.entityEditing;
      this.processEditing();
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
        this.navService.data = {collectedBy: this.collectedBy, parentLevel: this.selectedHierarchy[this.selectedHierarchy.length -1].extId};
        this.navController.navigateForward("/create-location").then(() => {
          this.syncObservable.publishChange("Baseline:CreateLocation");
        });
        break;
      case 'socialGroup':
        this.navService.data = {collectedBy: this.collectedBy, location: this.selectedLocation};
        this.navController.navigateForward("/create-social-group").then(() => {
          this.syncObservable.publishChange("Baseline:CreateSocialGroup");
        });
        break;
      case 'individual':
        this.navService.data = {collectedBy: this.collectedBy, loc: this.selectedLocation, sg: this.selectedSocialGroup};
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

  segmentChanged(event){
    this.baselineStep = event.value;
    this.reloadEntityList()
  }

  // Complete baseline: fillout visit form, and send to Summary page.
  completeBaselineCensus(){
    this.navService.data = {collectedBy: this.collectedBy, visitLocation: this.selectedLocation};
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

  processEditing(){
     this.selectedHierarchy.push(new Hierarchy(), new Hierarchy()); //Filler for hierarchy root and country level
     this.navService.data.selectedHierarchy.forEach(hier => this.selectedHierarchy.push(hier));
     switch(this.navService.data.entity){
       case 'locations':
         this.selectedLocation = this.navService.data.selectedLocation;
         this.toggleGroup('location');
         this.baselineStep = 'location';
         break;
       case 'socialGroups':
         this.selectedLocation = this.navService.data.selectedLocation;
         this.selectedSocialGroup = this.navService.data.selectedSocialGroup;
         this.toggleGroup('socialGroup');
         this.baselineStep = 'socialGroup';
         break;
       case 'individuals':
         this.selectedLocation = this.navService.data.selectedLocation;
         this.selectedSocialGroup = this.navService.data.selectedSocialGroup;
         this.navService.data.selectedIndividuals.forEach(ind => this.selectedIndividuals.push(ind));
         this.baselineStep = 'individual';
         this.toggleGroup('individual');
         break;
     }

  }

  saveBaselineReferences(){

  }
}
