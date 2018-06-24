import { Component } from '@angular/core';
import {Events, IonicPage, LoadingController, ViewController} from 'ionic-angular';
import { LocationsProvider } from "../../providers/locations/locations-provider";
import {LocationHierarchiesProvider} from "../../providers/location-hierarchies/location-hierarchies";
import {SocialGroupProvider} from "../../providers/social-group/social-group";
import {IndividualProvider} from "../../providers/individual/individual";
import {FieldworkerProvider} from "../../providers/fieldworker/fieldworker";
import {NetworkConfigProvider} from "../../providers/network-config/network-config";

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
  fieldworkerSyncSuccess: boolean;
  locationLevelsSyncSuccess: boolean;
  locationSyncSuccess: boolean;
  sgSyncSuccess: boolean;
  individualSyncSuccess: boolean;

  constructor(public events: Events, public loadingCtrl: LoadingController, public networkConfig: NetworkConfigProvider,
              public viewCtrl: ViewController,
              public lhProvider: LocationHierarchiesProvider, public locProvider: LocationsProvider,
              public sgProvider: SocialGroupProvider, public indProvider: IndividualProvider, public fwProvider: FieldworkerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchronizeDbPage');
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  async syncDatabase(){
    await this.syncFieldworkers();
    await this.syncLocLevels();
    await this.syncLocations();
    await this.syncSocialGroups();
    await this.syncIndividuals();

  }

  async syncFieldworkers(){
    this.fieldworkerSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing fieldworkers... Please wait"
    });

    loading.present();
    await this.fwProvider.loadInitData().catch((err) => { this.fieldworkerSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent("fieldworkerSync")
  }

  async syncLocLevels(){
    this.locationLevelsSyncSuccess = true;

    let loading = this.loadingCtrl.create({
      content: "Synchronizing location levels... Please wait"
    });

    loading.present();
    await this.lhProvider.loadLevels().catch((err) =>  this.locationLevelsSyncSuccess = false );
    await this.lhProvider.loadHierarchy().catch((err) => this.locationLevelsSyncSuccess = false);
    loading.dismiss();
    this.publishSynchronizationEvent("hierarchySync")

  }
  async syncLocations(){
    this.locationSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing location... Please wait"
    });

    loading.present();
    await this.locProvider.loadInitData().catch((err) =>  this.locationSyncSuccess = false);
    //await this.locProvider.synchronizeOfflineLocations().catch((err) => { console.log(err); this.locationSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent("locationSync")
  }

  async syncSocialGroups(){
    this.sgSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing social groups... Please wait"
    });

    loading.present();
    await this.sgProvider.loadInitData().catch((err) => { this.sgSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent("socialGroupSync")
  }

  async syncIndividuals(){
    this.individualSyncSuccess = true;
    let loading = this.loadingCtrl.create({
      content: "Synchronizing individuals... Please wait"
    });

    loading.present();
    await this.indProvider.loadInitData().catch((err) => { this.individualSyncSuccess = false; });
    loading.dismiss();
    this.publishSynchronizationEvent("individualSync")
  }

  publishSynchronizationEvent(topic){
    this.events.publish(topic, true);
  }
}
