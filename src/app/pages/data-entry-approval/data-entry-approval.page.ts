import { Component, OnInit } from '@angular/core';
import {LocationFormGroup} from "../../census-forms/location-form";
import {SocialGroupFormGroup} from "../../census-forms/social-group-form";
import {CensusIndividualFormGroup} from "../../census-forms/individual-form";
import {VisitFormGroup} from "../../census-forms/visit-form";
import {SocialGroup} from "../../models/social-group";
import {Location} from "../../models/location";
import {Individual} from "../../models/individual";
import {Visit} from "../../models/visit";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {LocationService} from "../../services/LocationService/location.service";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {VisitService} from "../../services/VisitService/visit.service";

@Component({
  selector: 'data-entry-approval',
  templateUrl: './data-entry-approval.page.html',
  styleUrls: ['./data-entry-approval.page.scss'],
})
export class DataEntryApprovalPage implements OnInit {
  readonly PAGE_NAME = 'Data Entry Approval';

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

  constructor(public individualService: IndividualService, public locationService: LocationService,
              public socialGroupService: SocialGroupService, public visitService: VisitService) {
  }

  ngOnInit() {
    this.loadData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataEntryApproval page');
  }

  async filterByNonProcessedData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationService.getAllLocations().then(x => this.filteredLocations = x.filter(entry => entry.processed == false));
        break;
      case 'socialgroups':
        await this.socialGroupService.getAllSocialGroups().then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == false));
        break;
      case 'individuals':
        await this.individualService.getAllIndividuals().then(x => this.filteredIndividuals = x.filter(entry => entry.processed == false));
        break;
      case 'visits':
        await this.visitService.getAllVisits().then(x => this.filteredVisits = x.filter(entry => entry.processed == false));
        break;
    }
  }

  async filterByProcessedData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationService.getAllLocations().then(x => this.filteredLocations = x.filter(entry => entry.processed == true));
        break;
      case 'socialgroups':
        await this.socialGroupService.getAllSocialGroups().then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == true));
        break;
      case 'individuals':
        await this.individualService.getAllIndividuals().then(x => this.filteredIndividuals = x.filter(entry => entry.processed == true));
        break;
      case 'visits':
        await this.visitService.getAllVisits().then(x => this.filteredVisits = x.filter(entry => entry.processed == true));
        break;
    }
  }

  async filterAllData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationService.getAllLocations().then(x => this.filteredLocations = x);
        break;
      case 'socialgroups':
        await this.socialGroupService.getAllSocialGroups().then(x => this.filteredSocialGroups);
        break;
      case 'individuals':
        await this.individualService.getAllIndividuals().then(x => this.filteredIndividuals = x);
        break;
      case 'visits':
        await this.visitService.getAllVisits().then(x => this.filteredVisits = x);
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
        await this.locationService.update(this.selectedEntry);
        break;
      case "socialgroups":
        await this.socialGroupService.update(this.selectedEntry);
        break;
      case "individuals":
        await this.individualService.update(this.selectedEntry);
        break;
      case "visits":
        await this.visitService.update(this.selectedEntry);
        break;

    }
  }

  viewEntryForApproval(entry) {
    this.selectedEntry = entry;
    this.viewEntry = true;
    switch (this.selectedForReview) {
      case 'locations':
        this.locationForm = new LocationFormGroup();
        for(let prop in this.locationForm.controls){
          this.locationForm.get(prop).setValue(entry[prop])
        }
        break;
      case 'socialgroups':
        this.socialGroupForm = new SocialGroupFormGroup();
        for(let prop in this.socialGroupForm.controls){
          this.socialGroupForm.get(prop).setValue(entry[prop])
        }
        break;
      case 'individuals':
        this.individualForm = new CensusIndividualFormGroup();
        for(let prop in this.individualForm.controls){
          this.individualForm.get(prop).setValue(entry[prop])
        }
        break;
      case 'visits':
        this.visitForm = new VisitFormGroup();
        for(let prop in this.visitForm.controls){
          this.visitForm.get(prop).setValue(entry[prop])
        }
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
