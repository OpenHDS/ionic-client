import { Component, OnInit } from '@angular/core';
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Hierarchy} from "../../models/hierarchy";
import {SocialGroup} from "../../models/social-group";
import {Individual} from "../../models/individual";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";
import {Location} from "../../models/location";
import {Events, NavController} from "@ionic/angular";
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
  selectedIndividuals: Individual[] = [];
  baselineStep = 'hierarchy';

  constructor(public syncObservable: SynchonizationObservableService, public locHierarchyService: LocationHierarchyService,
              public navController: NavController,
              public navService: NavigationService) {

    this.syncObservable.subscribe("Location:Create:Success", (location) => {
      console.log(location);
      this.setSelectedLocation(location);
    });

  }

  async ngOnInit() {
    this.levels = await this.locHierarchyService.getLevels();
    this.selectedHierarchy = [];
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
        if (this.selectedIndividuals !== undefined && this.selectedIndividuals.length > 0) {
          this.moveToNextBaselineStep('visit');
        }
        break;
      default: break;
    }
  }

  async goToCreatePage(){
    switch (this.baselineStep) {
      case 'location':
        this.navService.data = {collectedBy: this.collectedBy, parentLevel: this.selectedHierarchy[this.selectedHierarchy.length -1].extId};
        console.log((this.navService.data));
        this.navController.navigateForward("/create-location").then(() => {
          console.log("Baseline: Create Location Event");
          this.syncObservable.publishChange("Baseline:CreateLocation");
        });
        break;
      case 'socialGroup':
        break;
      case 'individual':
        break;
      default: break;
    }
  }
  moveToNextBaselineStep(step) {
    this.baselineStep = step;
  }


}
