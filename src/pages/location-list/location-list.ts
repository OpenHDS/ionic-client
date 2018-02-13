import {Component, OnInit, Output} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Location} from "../../providers/locations/locations-db";
import {LocationsProvider} from "../../providers/locations/locations-provider";
import {CreateLocationModalPage} from "../create-location-modal/create-location-modal";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";

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

  async ngOnInit() {
    //Initialize data and then get all locations for display.
    await this.locProvider.initProvider().then(()  => {
      this.locations = this.locProvider.getAllLocations();
    }).then(() => console.log("Location Data loaded"));
  }

  async synchronize() {
    await this.locProvider.updateLocationsList().then(() => this.locations = this.locProvider.getAllLocations());
  }

  presentCreationPage(){
    const createPage = this.modalCtrl.create(CreateLocationModalPage);
    createPage.present();

    createPage.onDidDismiss(data => {
      if(data != null)
        this.locProvider.saveData(data.loc)
    });
  }

  selectLocation(location: Location){
    this.selectedLoc = location;
  }
}
