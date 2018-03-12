import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController } from 'ionic-angular';
import { LocationsProvider } from "../../providers/locations/locations-provider";
import { RefreshObservable } from "../../providers/RefreshObservable";

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

  constructor(public events: Events, public locProvider: LocationsProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchronizeDbPage');
  }

  async syncDatabase(){
    await this.syncLocations();
  }

  async syncLocations(){
    let loading = this.loadingCtrl.create({
      content: "Synchronizing location... Please wait"
    });

    loading.present();
    await this.locProvider.initProvider();
    await this.locProvider.synchronizeOfflineLocations();
    loading.dismiss();
    this.publishSynchronizationEvent()
  }

  publishSynchronizationEvent(){
    this.events.publish('syncDb', true);
  }
}
