import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController } from 'ionic-angular';
import { LocationsProvider } from "../../providers/locations/locations-provider";
import { RefreshObservable } from "../../providers/RefreshObservable";
import {LocationHierarchiesProvider} from "../../providers/location-hierarchies/location-hierarchies";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {IndividualProvider} from "../../providers/individual/individual";

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
  locationLevelsSyncSuccess: boolean;
  locationSyncSuccess: boolean;
  sgSyncSuccess: boolean;
  individualSyncSuccess: boolean;

  constructor(public events: Events, public loadingCtrl: LoadingController,
              public lhProvider: LocationHierarchiesProvider, public locProvider: LocationsProvider,
              public sgProvider: SocialGroupProvider, public indProvider: IndividualProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchronizeDbPage');
  }

  async syncDatabase(){
    await this.syncLocLevels();
    await this.syncLocations();
    await this.syncSocialGroups();
    await this.syncIndividuals();

  }

  async syncLocLevels(){
    this.locationLevelsSyncSuccess = true;

    let loading = this.loadingCtrl.create({
      content: "Synchronizing location levels... Please wait"
    });

    loading.present();
    await this.lhProvider.initLevels().catch((err) =>  this.locationLevelsSyncSuccess = false );
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
    await this.locProvider.initProvider().catch((err) =>  this.locationSyncSuccess = false);
    //await this.locProvider.synchronizeOfflineLocations().catch((err) => { console.log(err); this.locationSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent()
  }

  async syncSocialGroups(){
    this.sgSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing social groups... Please wait"
    });

    loading.present();
    await this.sgProvider.initProvider().catch((err) => { this.sgSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent()
  }

  async syncIndividuals(){
    this.individualSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing individuals... Please wait"
    });

    loading.present();
    await this.indProvider.initProvider().catch((err) => { this.individualSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent()
  }

  publishSynchronizationEvent(){
    this.events.publish('syncDb', true);
  }
}
