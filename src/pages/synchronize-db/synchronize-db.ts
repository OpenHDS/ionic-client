import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController } from 'ionic-angular';
import { LocationsProvider } from "../../providers/locations/locations-provider";
import { RefreshObservable } from "../../providers/RefreshObservable";
import {LocationHierarchiesProvider} from "../../providers/location-hierarchies/location-hierarchies";

/**
 * Generated class for the SynchronizeDbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'synchronize-db',
  templateUrl: 'synchronize-db.html',
})
export class SynchronizeDbPage {
  synchonizeObserver: RefreshObservable = new RefreshObservable();
  locationSyncSuccess: boolean;
  locationLevelsSyncSuccess: boolean;


  constructor(public events: Events, public loadingCtrl: LoadingController,
              public locProvider: LocationsProvider, public lhProvider: LocationHierarchiesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchronizeDbPage');
  }

  async syncDatabase(){
    await this.syncLocations();
  }

  async syncLocLevels(){
    this.locationLevelsSyncSuccess = true;

    let loading = this.loadingCtrl.create({
      content: "Synchronizing location levels... Please wait"
    });

    loading.present();
    await this.lhProvider.initLevels().catch((err) => { this.locationSyncSuccess = false; });
    await this.lhProvider.initHierarchy().catch((err) => this.locationLevelsSyncSuccess = false);
    loading.dismiss();
    this.publishSynchronizationEvent()

  }
  async syncLocations(){
    this.locationSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing location... Please wait"
    });

    loading.present();
    await this.locProvider.initProvider().catch((err) => { this.locationSyncSuccess = false; });
    await this.locProvider.synchronizeOfflineLocations().catch((err) => { console.log(err); this.locationSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent()
  }

  publishSynchronizationEvent(){
    this.events.publish('syncDb', true);
  }
}
