import {Component, OnInit, Output} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
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

export class LocationListPage implements OnInit {
  locations:Promise<Location[]>;
  selectedLoc: Location = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public locProvider: LocationsProvider,
    public modalCtrl: ModalController, public networkConfig: NetworkConfigProvider) {
  }

  ngOnInit() {
      this.locations = this.locProvider.getAllLocations();
  }

  async synchronize() {
    await this.locProvider.updateLocationsList()
      .then(() => this.locations = this.locProvider.getAllLocations())
      .then(() => this.locProvider.synchronizeOfflineLocations());
  }

  goToCreateLocPage(){
    this.navCtrl.push(CreateLocationPage);
  }

  selectLocation(location: Location){
    this.selectedLoc = location;
  }
}
