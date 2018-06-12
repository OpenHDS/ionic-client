import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
export class SearchEntitiesPage implements OnInit{
  filteredLocations: Location[];
  filteredSocialGroups: SocialGroup[];
  filteredIndividuals: Individual[];
  entityType: string = 'locations';

  constructor(public navCtrl: NavController, public navParams: NavParams, public sgProvider: SocialGroupProvider,
              public locProvider: LocationsProvider, public indProvider: IndividualProvider) {
  }

  ngOnInit(){
    this.loadList()
  }

  loadList(){
    switch(this.entityType){
      case 'locations':
        this.locProvider.getAllLocations().then(x => this.filteredLocations = x);
      case 'socialgroups':
        this.sgProvider.getAllSocialGroups().then(x => this.filteredSocialGroups = x);
      case 'individuals':
        this.indProvider.getAllIndividuals().then(x => this.filteredIndividuals = x);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchEntitiesPage');
  }

  async getResults(event){
    switch(this.entityType){
      case 'locations':
        await this.searchLocations(event);
      case 'socialgroups':
        await this.searchSocialGroups(event);
      case 'individuals':
        await this.searchForIndividuals(event);
    }

    }

    async searchLocations(query){
      this.filteredLocations = await this.locProvider.getAllLocations();

      var searchFor = query.target.value;

      if(searchFor && searchFor.trim() != ''){
        this.filteredLocations = this.filteredLocations.filter((item) => {
          return (item.extId.toLowerCase().indexOf(searchFor.toLowerCase()) > -1) ||
            (item.locationName.toLowerCase().indexOf(searchFor.toLowerCase()) > -1)
        })
      }
    }
    async searchSocialGroups(query){
      this.filteredSocialGroups = await this.sgProvider.getAllSocialGroups();

      var searchFor = query.target.value;

      if(searchFor && searchFor.trim() != ''){
        this.filteredSocialGroups = this.filteredSocialGroups.filter((item) => {
          return (item.extId.toLowerCase().indexOf(searchFor.toLowerCase()) > -1) ||
            (item.groupName.toLowerCase().indexOf(searchFor.toLowerCase()) > -1) ||
            (item.groupHead.extId.toLowerCase().indexOf(searchFor.toLowerCase()) > -1);
        })
      }
    }

    async searchForIndividuals(query){
      this.filteredIndividuals = await this.indProvider.getAllIndividuals();

      var searchFor = query.target.value;

      if(searchFor && searchFor.trim() != ''){
        this.filteredIndividuals = this.filteredIndividuals.filter((item) => {
          return (item.extId.toLowerCase().indexOf(searchFor.toLowerCase()) > -1) ||
            (item.firstName.toLowerCase().indexOf(searchFor.toLowerCase()) > -1) ||
            (item.lastName.toLowerCase().indexOf(searchFor.toLowerCase()) > -1);
        })
      }
    }

}
