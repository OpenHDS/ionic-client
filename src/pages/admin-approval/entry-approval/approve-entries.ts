import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {IndividualProvider} from "../../../services/individual/individual";
import {CensusSubmissionProvider} from "../../../services/census-submission/census-submission";
import {LocationsProvider} from "../../../services/locations/locations-provider";
import {SocialGroupProvider} from "../../../services/social-group/social-group";
import {VisitsProvider} from "../../../services/visits/visits";
import {Location} from "../../../model/locations";
import {SocialGroup} from "../../../model/social-groups";
import {Visit} from "../../../model/visit";
import {CensusIndividualFormGroup} from "../../../census-forms/individual-form";
import {LocationFormGroup} from "../../../census-forms/location-form";
import {SocialGroupFormGroup} from "../../../census-forms/social-group-form";
import {VisitFormGroup} from "../../../census-forms/visit-form";
import {Individual} from "../../../model/individual";

/**
 * Generated class for the ApproveEntriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'approve-entries',
  templateUrl: 'approve-entries.html',
})

export class ApproveEntriesPage implements OnInit {
  locationForm: LocationFormGroup;
  socialGroupForm: SocialGroupFormGroup;
  individualForm: CensusIndividualFormGroup;
  visitForm: VisitFormGroup;


  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: Individual[];
  filteredVisits: Visit[];
  selectedForReview: string = "locations";
  viewEntry: boolean;
  viewMethod: string = "notApproved";
  selectedEntry: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController,
              public modalController: ModalController, public indProvider: IndividualProvider,
              public censusSub: CensusSubmissionProvider, public locationProvider: LocationsProvider,
              public socialGroupProvider: SocialGroupProvider, public visitProvider: VisitsProvider) {
  }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.view.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveEntriesPage');
  }

  async filterByNonProcessedData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationProvider.getAllLocations().then(x => this.filteredLocations = x.filter(entry => entry.processed == false));
        break;
      case 'socialgroups':
        await this.socialGroupProvider.getAllSocialGroups().then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == false));
        break;
      case 'individuals':
        await this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x.filter(entry => entry.processed == false));
        break;
      case 'visits':
        await this.visitProvider.getAllVisits().then(x => this.filteredVisits = x.filter(entry => entry.processed == false));
        break;
    }
  }

  async filterByProcessedData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationProvider.getAllLocations().then(x => this.filteredLocations = x.filter(entry => entry.processed == true));
        break;
      case 'socialgroups':
        await this.socialGroupProvider.getAllSocialGroups().then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == true));
        break;
      case 'individuals':
        await this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x.filter(entry => entry.processed == true));
        break;
      case 'visits':
        await this.visitProvider.getAllVisits().then(x => this.filteredVisits = x.filter(entry => entry.processed == true));
        break;
    }
  }

  async filterAllData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationProvider.getAllLocations().then(x => this.filteredLocations = x);
        break;
      case 'socialgroups':
        await this.socialGroupProvider.getAllSocialGroups().then(x => this.filteredSocialGroups);
        break;
      case 'individuals':
        await this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x);
        break;
      case 'visits':
        await this.visitProvider.getAllVisits().then(x => this.filteredVisits = x);
        break;
    }
  }
  async loadData() {
    if(this.viewMethod == 'notApproved'){
      this.filterByNonProcessedData()
    } else if(this.viewMethod == 'approved'){
      this.filterByProcessedData()
    } else {
      this.filterAllData();
    }
  }


  approve() {
    this.selectedEntry.processed = true;
    if (this.selectedEntry.errorReported)
      this.selectedEntry.errorReported = false;

    this.updateDataEntry();
  }

  markForCorrection() {
    this.selectedEntry.errorReported = true;
    if (this.selectedEntry.processed)
      this.selectedEntry.processed = false;

    this.updateDataEntry();
  }

  async updateDataEntry() {
    console.log(this.selectedForReview);
    switch (this.selectedForReview) {
      case "locations":
        await this.locationProvider.update(this.selectedEntry);
        break;
      case "socialgroups":
        await this.socialGroupProvider.update(this.selectedEntry);
        break;
      case "individuals":
        await this.indProvider.update(this.selectedEntry);
        break;
      case "visits":
        await this.visitProvider.update(this.selectedEntry);
        break;

    }
  }

  viewEntryForApproval(entry) {
    this.selectedEntry = entry;
    this.viewEntry = true;
    switch (this.selectedForReview) {
      case 'locations':
        this.locationForm = new LocationFormGroup();
        break;
      case 'socialgroups':
        this.socialGroupForm = new SocialGroupFormGroup();
        break;
      case 'individuals':
        this.individualForm = new CensusIndividualFormGroup();
        break;
      case 'visits':
        this.visitForm = new VisitFormGroup();
        break;
    }
  }

  async setSelectedForReview(selected) {
    this.selectedForReview = selected;
    this.viewEntry = false;
    this.selectedEntry = null;
    await this.loadData();
  }
}
