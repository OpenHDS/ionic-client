import { Component, OnInit } from '@angular/core';
import {SocialGroup} from "../../models/social-group";
import {Individual} from "../../models/individual";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {AlertController, NavController} from "@ionic/angular";
import {LocationService} from "../../services/LocationService/location.service";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {Location} from "../../models/location";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";
import {Router} from "@angular/router";

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  readonly PAGE_NAME = "Search";
  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: Individual[];

  //Option for looking up head of social group
  searchForHead: boolean = false;
  entityType: string = 'locations';

  constructor(public syncObservable: SynchonizationObservableService, public router: Router,
              public navService: NavigationService, public sgProvider: SocialGroupService, public alertCtrl: AlertController,
              public locProvider: LocationService, public indProvider: IndividualService) {

    if(this.navService.data !== undefined)
      this.entityType = this.navService.data.entity;

    if(this.navService.data !== undefined)
      this.searchForHead = this.navService.data.headLookup;
  }

  async ngOnInit() {
    await this.loadList()
  }


  async loadList() {
    switch (this.entityType) {
      case 'locations':
        await this.locProvider.getAllLocations().then(x => this.filteredLocations = x);
        break;
      case 'socialgroups':
        await this.sgProvider.getAllSocialGroups().then(x => this.filteredSocialGroups = x);
        break;
      case 'individuals':
        await this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x);
        break;
    }
  }

  async search(query) {
    var searchFor = query.target.value;
    await this.loadList();
    if (searchFor && searchFor.trim() != '') {
      switch (this.entityType) {
        case 'locations':
          await this.searchLocations(searchFor);
          break;
        case 'socialgroups':
          await this.searchSocialGroups(searchFor);
          break;
        case 'individuals':
          await this.searchForIndividuals(searchFor);
          break;
      }
    }

  }

  async searchLocations(query) {
    this.filteredLocations = this.filteredLocations.filter((item) => {
      return (item.extId.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
        (item.locationName.toLowerCase().indexOf(query.toLowerCase()) > -1)
    })

  }

  async searchSocialGroups(query) {
    this.filteredSocialGroups = this.filteredSocialGroups.filter((item) => {
      return (item.extId.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
        (item.groupName.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
        (item.groupHead.extId.toLowerCase().indexOf(query.toLowerCase()) > -1);
    })

  }

  async searchForIndividuals(query) {
    this.filteredIndividuals = this.filteredIndividuals.filter((item) => {
      return (item.extId.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
        (item.firstName.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
        (item.lastName.toLowerCase().indexOf(query.toLowerCase()) > -1);
    })
  }

  async returnSelection(item){
    switch (this.entityType) {
      case 'locations':
        this.syncObservable.publishChange("Search:Location", item);
        break;
      case 'socialgroups':
        await this.syncObservable.publishChange("Search:SocialGroup", item);
        break;
      case 'individuals':
        if (this.searchForHead) {
          this.syncObservable.publishChange("Search:SocialGroup:Head", item);
          this.router.navigate(["/create-social-group"]);

        }else
          this.syncObservable.publishChange("Search:Individual", item);
        break;
    }
    this.router.navigate(["/baseline"]);
  }

  async confirmSelection(item){
    let alert = await this.alertCtrl.create({
      header: "Confirm",
      subHeader: "Select and exit?",
      buttons: [{
        text: "Yes, select",
        handler: () => {this.returnSelection(item)}
      }, {
        text: "No"
      }]
    });

    alert.present();
  }

}
