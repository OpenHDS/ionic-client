import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Location } from "../../interfaces/locations";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {Hierarchy} from "../../interfaces/hierarchy";
import {SocialGroup} from "../../interfaces/social-groups";
import {Individual} from "../../interfaces/individual";
import {CreateVisitPage} from "../create-entities/create-visit";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {FieldworkerProvider} from "../../providers/fieldworker/fieldworker";

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
  levels = ["Region", "District", "Village", "Subvillage"];
  collectedBy;
  selectedHierarchy: Hierarchy[] = [];
  selectedLocation: Location;
  selectedSocialGrp: SocialGroup;
  selectedIndividuals: Individual[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public ev: Events,
              public prop: SystemConfigProvider, public userData: UserProvider, public fieldworkerProvider: FieldworkerProvider) {
  }

  async ngOnInit(){
    this.collectedBy = await this.fieldworkerProvider.getFieldworker(this.userData.getLoggedInUser());
    console.log(this,this.collectedBy);
  }

  setSelectedHierarchy(hierarchy: Hierarchy){
    console.log(hierarchy);
    this.selectedHierarchy[hierarchy.level.keyIdentifier] = hierarchy;
  }

  setLocation(location: Location){
    console.log(location);
    this.selectedLocation = location;
  }

  setSocialGroup(sg: SocialGroup){
    this.selectedSocialGrp = sg;
  }

  setSelectedIndividuals(ind: Individual){
    this.selectedIndividuals.push(ind);
  }

  async completeBaselineCensus(){
    await this.navCtrl.push(CreateVisitPage, {visitLocation: this.selectedLocation, collectedBy: this.collectedBy[0]});

    //Reset for new census collection.
    this.selectedHierarchy = [];
    this.selectedLocation = undefined;
    this.selectedSocialGrp = undefined;
    this.selectedIndividuals = [];
  }
}

