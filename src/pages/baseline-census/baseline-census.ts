import {Component, OnInit} from '@angular/core';
import {
  Events,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { Location } from "../../model/locations";
import {SystemConfigProvider} from "../../services/system-config/system-config";
import {Hierarchy} from "../../model/hierarchy";
import {SocialGroup} from "../../model/social-groups";
import {Individual} from "../../model/individual";
import {CreateVisitPage} from "../create-entities/create-visit";
import {DropdownSearchPage} from "../search/dropdown-search/dropdown-search";
import {AuthProvider} from "../../services/AuthenticationService/authentication";
import {Fieldworker} from "../../model/fieldworker";
import {LocationHierarchiesProvider} from "../../services/location-hierarchies/location-hierarchies";
import {HierarchyLevels} from "../../model/hierarchy-levels";

/**
 * Generated class for the BaselineCensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'baseline-census',
  templateUrl: 'baseline-census.html'
})

export class BaselineCensusPage implements OnInit{
  levels: Array<HierarchyLevels>;
  collectedBy: Fieldworker;
  selectedHierarchy: Array<Hierarchy>;
  selectedLocation: Location;
  selectedSocialGroup: SocialGroup;
  selectedIndividuals: Individual[] = [];
  baselineStep = 'hierarchy';
  constructor(public navCtrl: NavController, public view: ViewController ,public navParams: NavParams,
              public modalCntrl: ModalController, public ev: Events, public locHierarchyProvider: LocationHierarchiesProvider,
              public prop: SystemConfigProvider, public authProvider: AuthProvider) {

    this.ev.subscribe("adminFWSelection", async (fieldworker) => {
      this.collectedBy = fieldworker.fieldworker;
    });
  }

  async ngOnInit() {
    this.fieldworkerLookup();
    this.levels = await this.locHierarchyProvider.getLevels();
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

  moveToNextBaselineStep(step) {
    this.baselineStep = step;
  }


  //Lookup fieldworker for admin census input.
  async fieldworkerLookup(){
    if(this.authProvider.hasSupervisorLoggedIn()){
      let modal = this.modalCntrl.create(DropdownSearchPage);
      modal.present();
    } else {
      this.collectedBy = this.authProvider.getLoggedInFieldworker();
    }
  }
}

