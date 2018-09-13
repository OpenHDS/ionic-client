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
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {Hierarchy} from "../../model/hierarchy";
import {SocialGroup} from "../../model/social-groups";
import {Individual} from "../../model/individual";
import {CreateVisitPage} from "../create-entities/create-visit";
import {DropdownSearchPage} from "../search/dropdown-search/dropdown-search";
import {AuthProvider} from "../../providers/authentication/authentication";
import {Fieldworker} from "../../model/fieldworker";

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
  collectedBy: Fieldworker;
  selectedHierarchy: Hierarchy[] = [];
  selectedLocation: Location;
  selectedSocialGrp: SocialGroup;
  selectedIndividuals: Individual[] = [];
  constructor(public navCtrl: NavController, public view: ViewController ,public navParams: NavParams,
              public modalCntrl: ModalController, public ev: Events,
              public prop: SystemConfigProvider, public authProvider: AuthProvider) {

    this.ev.subscribe("adminFWSelection", async (fieldworker) => {
      console.log("setting admin fieldworker selection....");
      console.log(fieldworker.fieldworker);
      this.collectedBy = fieldworker.fieldworker;
      console.log("Collected by stored...");
      console.log(this.collectedBy);
    });
  }

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  async ngOnInit(){
    this.fieldworkerLookup();
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
    this.collectedBy = undefined;
    this.selectedLocation = undefined;
    this.selectedSocialGrp = undefined;
    this.selectedIndividuals = [];
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

