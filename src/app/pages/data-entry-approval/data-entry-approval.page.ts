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
import {ErrorService} from "../../services/ErrorService/error-service";
import {ModalController} from "@ionic/angular";
import {ErrorReportingComponent} from "../../components/error-reporting/error-reporting.component";
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {NavigationEnd, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'data-entry-approval',
  templateUrl: './data-entry-approval.page.html',
  styleUrls: ['./data-entry-approval.page.scss'],
})
export class DataEntryApprovalPage implements OnInit {
  readonly PAGE_NAME = 'Data Entry Approval';

  form: any;


  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: Individual[];
  filteredVisits: Visit[];
  selectedForReview: string = "locations";
  viewEntry: boolean;
  viewMethod: string = "notApproved";
  selectedEntry: any;
  navigationSubscription;

  constructor(public router: Router, public modalCtrl: ModalController, public navParams: NavigationService,
              public individualService: IndividualService, public locationService: LocationService, public translate: TranslateService,
              public socialGroupService: SocialGroupService, public visitService: VisitService, public errorService: ErrorService) {

    // Reload page when clicked on from menu to remove data from when last loaded
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.reloadPage();
      }
    });
  }

  reloadPage(){
    this.filteredLocations = undefined;
    this.filteredSocialGroups = undefined;
    this.filteredIndividuals = undefined;
    this.filteredVisits = undefined;
    this.selectedForReview = "locations";
    this.viewEntry = undefined;
    this.viewMethod = "notApproved";
    this.selectedEntry = undefined
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
        await this.locationService.getAllLocations()
          .then(x => this.filteredLocations = x.filter(entry => entry.processed == false));
        break;
      case 'socialgroups':
        await this.socialGroupService.getAllSocialGroups()
          .then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == false));
        break;
      case 'individuals':
        await this.individualService.getAllIndividuals()
          .then(x => this.filteredIndividuals = x.filter(entry => entry.processed == false));
        break;
      case 'visits':
        await this.visitService.getAllVisits()
          .then(x => this.filteredVisits = x.filter(entry => entry.processed == false));
        break;
    }
  }

  async filterByProcessedData(){
    switch (this.selectedForReview) {
      case 'locations':
        await this.locationService.getAllLocations()
          .then(x => this.filteredLocations = x.filter(entry => entry.processed == true));
        break;
      case 'socialgroups':
        await this.socialGroupService.getAllSocialGroups()
          .then(x => this.filteredSocialGroups = x.filter(entry => entry.processed == true));
        break;
      case 'individuals':
        await this.individualService.getAllIndividuals()
          .then(x => this.filteredIndividuals = x.filter(entry => entry.processed == true));
        break;
      case 'visits':
        await this.visitService.getAllVisits()
          .then(x => this.filteredVisits = x.filter(entry => entry.processed == true));
        break;
    }
  }

  async loadData() {
    if(this.viewMethod == 'notApproved'){
      this.filterByNonProcessedData()
    } else if(this.viewMethod == 'approved'){
      this.filterByProcessedData()
    }
  }


  approve() {
    this.selectedEntry.processed = true;
    this.selectedEntry.status = 'A';
    if (this.selectedEntry.errorReported) {
      this.selectedEntry.errorReported = false;
      this.errorService.findAndMarkResolved(this.selectedEntry.extId);
    }
    this.updateDataEntry();
  }

  markForCorrection() {
    this.selectedEntry.status = 'P';
    this.selectedEntry.errorReported = true;
    if (this.selectedEntry.processed)
      this.selectedEntry.processed = false;

    for(let prop in this.form.controls){
      if(this.form.get(prop).dirty){
        this.selectedEntry[prop] = this.form.get(prop).value;
      }
    }

    this.createErrorModal();
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
        this.form = new LocationFormGroup(this.translate);
        break;
      case 'socialgroups':
        this.form = new SocialGroupFormGroup(this.translate);
        break;
      case 'individuals':
        this.form = new CensusIndividualFormGroup(this.translate);
        break;
      case 'visits':
        this.form = new VisitFormGroup(this.translate);
        break;
    }

    for(let prop in this.form.controls){
      this.form.get(prop).setValue(entry[prop])
    }
  }

  async setSelectedForReview(selected) {
    this.selectedForReview = selected;
    this.viewEntry = false;
    this.selectedEntry = null;
    await this.loadData();
  }


  async createErrorModal(){
    this.navParams.data = {'entityId': this.selectedEntry.extId, 'entityType': this.selectedForReview};
    let modal = await this.modalCtrl.create({
      component: ErrorReportingComponent
    });

    return await modal.present();
  }

}
