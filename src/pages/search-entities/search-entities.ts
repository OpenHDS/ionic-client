import {Component, OnInit} from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  ViewController
} from 'ionic-angular';
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {IndividualProvider} from "../../providers/individual/individual";
import {SocialGroup} from "../../model/social-groups";
import {Individual} from "../../model/individual";
import {Location} from "../../model/locations";

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

  //Option for looking up head of social group
  searchForHead: boolean;
  entityType: string = 'locations';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public sgProvider: SocialGroupProvider, public ev: Events, public alertCtrl: AlertController,
              public locProvider: LocationsProvider, public indProvider: IndividualProvider) {

    if(this.navParams.get("lookup") != null)
      this.entityType = this.navParams.get("lookup");

    if(this.navParams.get("headLookup") != null)
      this.searchForHead = this.navParams.get("headLookup");
    }

  async ngOnInit() {
    await this.loadList()
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
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

  async returnSelection(item){
    switch (this.entityType) {
      case 'locations':
       this.ev.publish("locationSearch", item);
      case 'socialgroups':
        await this.ev.publish("socialGroupSearch", item);
      case 'individuals':
        if (this.searchForHead)
          this.ev.publish("socialGroupHeadSearch", item);
        else
          this.ev.publish("individualSearch", item);
    }
    this.navCtrl.pop();
  }

  confirmSelection(item){
    let alert = this.alertCtrl.create({
      title: "Confirm",
      subTitle: "Select and exit?",
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
