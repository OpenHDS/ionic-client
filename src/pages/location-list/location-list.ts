import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Location } from "../../providers/locations/locations-db";
import { LocationsProvider } from "../../providers/locations/locations-provider";

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
  locations: Location[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public locProvider: LocationsProvider) {
  }

  async ngOnInit(){
    //Initialize data and then get all locations for display.
    await this.locProvider.initProvider().then(async () => {
      this.locations = await this.locProvider.getAllLocations()
    });
  }

  async synchronize(){
    await this.locProvider.synchronizeLocations().then(async() => {
      this.locations = await this.locProvider.getAllLocations();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationListPage');
  }

}
