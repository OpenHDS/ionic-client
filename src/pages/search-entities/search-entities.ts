import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {IndividualProvider} from "../../providers/individual/individual";
import {SocialGroup} from "../../interfaces/social-groups";
import {Individual} from "../../interfaces/individual";
import {Location} from "../../interfaces/locations";

/**
 * Generated class for the SearchEntitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-entities',
  templateUrl: 'search-entities.html',
})
export class SearchEntitiesPage implements OnInit {
  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: Individual[];
  entityType: string = 'locations';

  constructor(public navCtrl: NavController, public navParams: NavParams, public sgProvider: SocialGroupProvider,
              public locProvider: LocationsProvider, public indProvider: IndividualProvider) {
  }

  async ngOnInit() {
    await this.loadList()
  }

  async loadList() {
    switch (this.entityType) {
      case 'locations':
        await this.locProvider.getAllLocations().then(x => this.filteredLocations = x);
      case 'socialgroups':
        await this.sgProvider.getAllSocialGroups().then(x => this.filteredSocialGroups = x);
      case 'individuals':
        await this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x);
    }
  }

  async search(query) {
    var searchFor = query.target.value;
    await this.loadList();
    if (searchFor && searchFor.trim() != '') {
      switch (this.entityType) {
        case 'locations':
          await this.searchLocations(searchFor);
        case 'socialgroups':
          await this.searchSocialGroups(searchFor);
        case 'individuals':
          await this.searchForIndividuals(searchFor);
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

}
