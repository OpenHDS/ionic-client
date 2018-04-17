import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { LocationListPage } from "../entity-lists/location-list";
import { Location } from "../../providers/locations/locations-db";
import {FieldworkerMenuPage} from "../fieldworker-menu/menu";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {Hierarchy} from "../../providers/location-hierarchies/hierarchy-db";
import {SocialGroup} from "../../providers/social-group/socialGroup-db";
import {Individual} from "../../providers/individual/individual-db";

/**
 * Generated class for the BaselineCensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'baseline-census',
  templateUrl: 'baseline-census.html',
})

export class BaselineCensusPage implements OnInit{
  levels = ["Region", "District", "Village", "Subvillage"];

  selectedHierarchy: Hierarchy[] = [];
  selectedLocation: Location;
  selectedSocialGrp: SocialGroup;
  selectedIndividuals: Individual[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuPopover: PopoverController, public ev: Events,
              public prop: SystemConfigProvider) {
  }

  ngOnInit(){
  }


  displayMenu(event){
    let popover = this.menuPopover.create(FieldworkerMenuPage);
    popover.present({
      ev: event
    });
  };

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
}

