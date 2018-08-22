import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {IndividualProvider} from "../../providers/individual/individual";
import {CensusSubmissionProvider} from "../../providers/census-submission/census-submission";
import {CensusIndividual} from "../../model/census-individual";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {VisitsProvider} from "../../providers/visits/visits";
import {Location} from "../../model/locations";
import {SocialGroup} from "../../model/social-groups";
import {Visit} from "../../model/visit";
import {CensusIndividualFormGroup} from "../../census-forms/individual-form";
import {LocationFormGroup} from "../../census-forms/location-form";
import {SocialGroupFormGroup} from "../../census-forms/social-group-form";
import {VisitFormGroup} from "../../census-forms/visit-form";
import {Individual} from "../../model/individual";

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
  selectedEntry: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController, public indProvider: IndividualProvider,
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

  async loadData() {
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
