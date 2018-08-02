import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {IndividualProvider} from "../../providers/individual/individual";
import {Individual} from "../../interfaces/individual";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {CensusIndividual} from "../../interfaces/census-individual";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {VisitsProvider} from "../../providers/visits/visits";
import {Location} from "../../interfaces/locations";
import {SocialGroup} from "../../interfaces/social-groups";
import {Visit} from "../../interfaces/visit";
import {CensusIndividualFormGroup} from "../../census-forms/individual-form";
import {LocationFormGroup} from "../../census-forms/location-form";
import {SocialGroupFormGroup} from "../../census-forms/social-group-form";
import {VisitFormGroup} from "../../census-forms/visit-form";

/**
 * Generated class for the ApproveEntriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approve-entries',
  templateUrl: 'approve-entries.html',
})

export class ApproveEntriesPage implements OnInit{
  locationForm: LocationFormGroup;
  socialGroupForm: SocialGroupFormGroup;
  individualForm: CensusIndividualFormGroup;
  visitForm: VisitFormGroup;


  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: CensusIndividual[];
  filteredVisits: Visit[];
  selectedForReview: string = "locations";
  viewEntry: boolean;
  selectedEntry: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController, public indProvider: IndividualProvider,
              public censusSub: CensusSubmissionProvider, public locationProvider: LocationsProvider,
              public socialGroupProvider: SocialGroupProvider, public visitProvider: VisitsProvider) {
  }

  ngOnInit(){
    this.loadData();
  }

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveEntriesPage');
  }

  async loadData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationProvider.getAllLocations().then(x => this.filteredLocations = x.filter(entry => entry.processed==false));
      case 'socialgroups':
        await this.socialGroupProvider.getAllSocialGroups().then(x => this.filteredSocialGroups =  x.filter(entry => entry.processed == false));
      case 'individuals':
        await this.censusSub.getAllCensusSubmissions().then(x => this.filteredIndividuals =  x.filter(entry => entry.processed == false));
      case 'visits':
        await this.visitProvider.getAllVisits().then(x => this.filteredVisits = x.filter(entry => entry.processed == false));
    }

    console.log(this.filteredIndividuals);
  }


  approve(){
    this.selectedEntry.processed = true;
    if(this.selectedEntry.errorReported)
      this.selectedEntry.errorReported = false;

    this.updateDataEntry();
  }

  markForCorrection(){
    this.selectedEntry.errorReported = true;
    if(this.selectedEntry.processed)
      this.selectedEntry.processed = false;

    this.updateDataEntry();
  }

  updateDataEntry(){
    switch(this.selectedForReview){
      case "locations": this.locationProvider.update(this.selectedEntry);
      case "socialgroups": this.socialGroupProvider.update(this.selectedEntry);
      case "individuals": this.censusSub.sendCensusIndividual(this.selectedEntry);
      case "visits": this.visitProvider.update(this.selectedEntry);
    }
  }

  viewEntryForApproval(entry){
    this.selectedEntry = entry;
    this.viewEntry = true;
    switch (this.selectedForReview) {
      case 'locations':
        this.locationForm = new LocationFormGroup();
      case 'socialgroups':
        this.socialGroupForm = new SocialGroupFormGroup();
      case 'individuals':
        this.individualForm = new CensusIndividualFormGroup();
      case 'visits':
        this.visitForm = new VisitFormGroup();
    }
  }

  async setSelectedForReview(selected){
    this.selectedForReview = selected;
    this.viewEntry = false;
    this.selectedEntry = null;
    await this.loadData();
  }
}
