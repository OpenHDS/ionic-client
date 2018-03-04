import {Component, OnInit, Output} from '@angular/core';
import {IonicPage, Events, ModalController, NavController, NavParams} from 'ionic-angular';
import {Location} from "../../providers/locations/locations-db";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {CreateLocationModalPage} from "../create-location-modal/create-location-modal";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {CreateLocationPage} from "../create-location/create-location";

/**
 * Generated class for the LocationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'location-list',
  templateUrl: 'location-list.html',

})

export class LocationListPage implements OnInit{
  refreshNeeded:boolean = false;
  locations: Location[];
  selectedLoc: Location = null;

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public locProvider: LocationsProvider,
    public modalCtrl: ModalController, public networkConfig: NetworkConfigProvider) {

    this.ev.subscribe('submitLocation', () => {
      this.doRefresh();
    })
  }

  ngOnInit() {
    this.locProvider.initProvider().then(() => this.doRefresh());
  }

  doRefresh() {

    setTimeout(async () => {
      await this.getAllLocations();
      console.log("Refreshing....")
    }, 2000);

  }

  async getAllLocations() {
    this.locations = await this.locProvider.getAllLocations();
  }

  async synchronize() {
    await this.locProvider.updateLocationsList()
      .then(() => this.getAllLocations())
      .then(() => this.locProvider.synchronizeOfflineLocations());
  }

  goToCreateLocPage(){
    this.navCtrl.push(CreateLocationPage);
  }

  selectLocation(location: Location){
    this.selectedLoc = location;
  }

}
