import { Component, OnInit } from '@angular/core';
import {Events, LoadingController} from '@ionic/angular';
import {NetworkConfigurationService} from '../../services/NetworkService/network-config';
import {ErrorService} from '../../services/ErrorService/error-service';
import {LocationHierarchyService} from '../../services/LocationHierarchyService/location-hierarchy.service';
import {LocationService} from '../../services/LocationService/location.service';
import {SocialGroupService} from '../../services/SocialGroupService/social-group.service';
import {IndividualService} from '../../services/IndividualService/individual.service';
import {CensusSubmissionService} from '../../services/CensusSubmissionService/census-submission.service';
import {FieldworkerService} from '../../services/FieldworkerService/fieldworker.service';
import {VisitService} from "../../services/VisitService/visit.service";
import {NavigationEnd, Router} from "@angular/router";
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";
import {SyncInfoService} from "../../services/SyncInfoService/sync-info.service";
import {SyncInfo} from "../../models/sync";

@Component({
  selector: 'synchronize-db',
  templateUrl: './database-sync.page.html',
  styleUrls: ['./database-sync.page.scss'],
})
export class DatabaseSyncPage implements OnInit {
  readonly PAGE_NAME = "OpenHDS Database Synchronization";
  fieldworkerSync: SyncInfo;
  hierarchySync: SyncInfo;
  locationSync: SyncInfo;
  socialGroupSync: SyncInfo;
  individualSync: SyncInfo;
  errors: Object[] = [];
  navigationSubscription;

  constructor(public router: Router, public event: Events, public loadingCtrl: LoadingController, public networkConfig: NetworkConfigurationService,
              public errProvider: ErrorService, public syncService: SyncInfoService,
              public lhProvider: LocationHierarchyService, public locProvider: LocationService,
              public sgProvider: SocialGroupService, public indProvider: IndividualService,
              public censusProvider: CensusSubmissionService, public fwProvider: FieldworkerService,
              public visitService: VisitService, public syncObserver: SynchonizationObservableService) {

    // Reload page when clicked on from menu to remove data from when last loaded
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.reloadPage();
      }
    });

  }

  reloadPage(){
    this.ngOnInit();
    this.errors = [];
  }

  ngOnInit() {
    this.getFieldworkerSyncInfo();
    this.getHierarchySyncInfo();
    this.getLocationSyncInfo();
    this.getSocialGroupInfo();
    this.getIndividualInfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynchronizeDbPage');
  }

  ionViewWillEnter() {
  }

  async syncDatabase() {
    await this.syncFieldworkers();
    await this.syncLocLevels();
    await this.syncLocations();
    await this.syncSocialGroups();
    await this.syncIndividuals();

    // Publish change so baseline census page picks up sync changes (reloads data field display)
    this.syncObserver.publishChange("Baseline:Load");
  }

  async syncFieldworkers() {
    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing fieldworkers... Please wait',
    });

    loading.present();

    this.fwProvider.loadInitData().then(() => {
      let syncInfo = new SyncInfo();
      syncInfo.entity = 'fieldworker';
      syncInfo.success = true;
      syncInfo.time = new Date();
      this.fieldworkerSync = syncInfo;
      this.syncService.insertSyncInfo(syncInfo);
    }).catch((err) => {
      console.log(err);
      this.errors.push('Fieldworker Sync: ' + this.errProvider.mapErrorMessage(err.status));
    });

    loading.dismiss();
  }

  async syncLocLevels() {
    let syncInfo = new SyncInfo();
    syncInfo.entity = 'hierarchy';
    syncInfo.time = new Date();

    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing location levels... Please wait'
    });

    loading.present();
    await this.lhProvider.loadLevels().then( () => {
      syncInfo.success = true;
    }).catch((err) =>  {
      this.errors.push('Location Hierarchy Level Sync: ' + this.errProvider.mapErrorMessage(err.status));
      syncInfo.success = false;
    });

    await this.lhProvider.loadHierarchy().then(() => {
      syncInfo.success = true;
    }).catch((err) => {
      this.errors.push('Location Hierarchy Sync: ' + this.errProvider.mapErrorMessage(err.status));
      syncInfo.success = true;
    });

    this.syncService.insertSyncInfo(syncInfo);
    this.hierarchySync = syncInfo;
    loading.dismiss();

    this.syncObserver.publishChange('Census:Reload:Hierarchy');
  }

  async syncLocations() {
    let syncInfo = new SyncInfo();
    syncInfo.entity = 'location';
    syncInfo.time = new Date();

    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing location... Please wait'
    });

    loading.present();
    await this.locProvider.loadInitData().then(() => {
      syncInfo.success = true;
    }).catch((err) => {
      this.errors.push('Location Sync: ' + this.errProvider.mapErrorMessage(err.status));
      syncInfo.success = false;
    });
    loading.dismiss();

    this.locationSync = syncInfo;
    this.syncService.insertSyncInfo(syncInfo);
    this.syncObserver.publishChange('Census:Reload:Location');

  }

  async syncSocialGroups() {
    let syncInfo = new SyncInfo();
    syncInfo.entity = 'socialGroup';
    syncInfo.time = new Date();

    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing social groups... Please wait'
    });

    loading.present();
    await this.sgProvider.loadInitData().then(() => {
      syncInfo.success = true;
    }).catch((err) => {
      this.errors.push('Social Group Sync: ' + this.errProvider.mapErrorMessage(err.status));
      syncInfo.success = false;
    });

    this.syncService.insertSyncInfo(syncInfo);
    this.socialGroupSync = syncInfo;

    this.syncObserver.publishChange('Census:Reload:SocialGroup');

    loading.dismiss();
  }

  async syncIndividuals() {
    let syncInfo = new SyncInfo();
    syncInfo.entity = 'individual';
    syncInfo.time = new Date();

    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing individuals... Please wait'
    });

    loading.present();
    await this.indProvider.loadInitData().then(() => {
      syncInfo.success = true;
    }).catch((err) => {
      this.errors.push('Individual Sync: ' + this.errProvider.mapErrorMessage(err.status));
      syncInfo.success = false;
    });

    this.syncService.insertSyncInfo(syncInfo);
    this.individualSync = syncInfo;

    this.syncObserver.publishChange('Census:Reload:Individual');

    loading.dismiss();
  }

  async syncNewDataWithServer() {
    await this.locProvider.synchronizeOfflineLocations().catch((err) => {console.log(err); this.locationSyncSuccess = false; });
    await this.sgProvider.synchronizeOfflineSocialGroups().catch(err => {console.log(err); this.sgSyncSuccess = false;});
    await this.indProvider.synchronizeOfflineIndividuals().catch(err => {console.log(err); this.individualSyncSuccess = false;});
    await this.visitService.synchronizeOfflineVisits().catch(err => console.log(err));
  }

  async getFieldworkerSyncInfo(){
    this.fieldworkerSync = await this.syncService.findSyncInfo('fieldworker');
  }

  async getHierarchySyncInfo(){
    this.hierarchySync = await this.syncService.findSyncInfo('hierarchy');
  }

  async getLocationSyncInfo(){
    this.locationSync = await this.syncService.findSyncInfo('location')
  }

  async getSocialGroupInfo(){
    this.socialGroupSync = await this.syncService.findSyncInfo('socialGroup');
  }

  async getIndividualInfo(){
    this.individualSync = await this.syncService.findSyncInfo('individual');
  }
}
