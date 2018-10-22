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

@Component({
  selector: 'synchronize-db',
  templateUrl: './database-sync.page.html',
  styleUrls: ['./database-sync.page.scss'],
})
export class DatabaseSyncPage implements OnInit {
  readonly PAGE_NAME = "OpenHDS Database Synchronization";
  fieldworkerSyncSuccess: boolean;
  locationLevelsSyncSuccess: boolean;
  locationSyncSuccess: boolean;
  sgSyncSuccess: boolean;
  individualSyncSuccess: boolean;
  errors: Object[] = [];

  constructor(public event: Events, public loadingCtrl: LoadingController, public networkConfig: NetworkConfigurationService,
              public errProvider: ErrorService,
              public lhProvider: LocationHierarchyService, public locProvider: LocationService,
              public sgProvider: SocialGroupService, public indProvider: IndividualService,
              public censusProvider: CensusSubmissionService, public fwProvider: FieldworkerService) {
  }

  ngOnInit() {
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

  }

  async syncFieldworkers() {
    this.fieldworkerSyncSuccess = true;
    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing fieldworkers... Please wait',
    });

    loading.present();
    await this.fwProvider.loadInitData().catch((err) => {
      this.errors.push('Fieldworker Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.fieldworkerSyncSuccess = false; });
    loading.dismiss();
  }

  async syncLocLevels() {
    this.locationLevelsSyncSuccess = true;

    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing location levels... Please wait'
    });

    loading.present();
    await this.lhProvider.loadLevels().catch((err) =>  {
      this.errors.push('Location Hierachy Level Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.locationLevelsSyncSuccess = false;
    });
    await this.lhProvider.loadHierarchy().catch((err) => {
      this.errors.push('Location Hierarchy Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.locationLevelsSyncSuccess = false;
    });
    loading.dismiss();

  }
  async syncLocations() {
    this.locationSyncSuccess = true;
    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing location... Please wait'
    });

    loading.present();
    await this.locProvider.loadInitData().catch((err) => {
      this.errors.push('Location Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.locationSyncSuccess = false;
    });
    loading.dismiss();
  }

  async syncSocialGroups() {
    this.sgSyncSuccess = true;
    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing social groups... Please wait'
    });

    loading.present();
    await this.sgProvider.loadInitData().catch((err) => {
      this.errors.push('Social Group Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.sgSyncSuccess = false;
    });
    loading.dismiss();
  }

  async syncIndividuals() {
    this.individualSyncSuccess = true;
    const loading = await this.loadingCtrl.create({
      message: 'Synchronizing individuals... Please wait'
    });

    loading.present();
    await this.indProvider.loadInitData().catch((err) => {
      this.errors.push('Individual Sync: ' + this.errProvider.mapErrorMessage(err.status));
      this.individualSyncSuccess = false;
    });
    loading.dismiss();
  }

  async syncNewDataWithServer() {
    // Sync Locations, Social Groups
    await this.locProvider.synchronizeOfflineLocations().catch((err) => { console.log(err); this.locationSyncSuccess = false; });
    await this.sgProvider.synchronizeOfflineSocialGroups().catch(err => {console.log(err); this.sgSyncSuccess = false;});

    // Sync CensusIndividuals
    // TODO: code needs to be moved to census individual provider
    const censusIndividuals = await this.censusProvider.getAllCensusSubmissions();
    censusIndividuals.forEach(async cenInd => {
      await this.censusProvider.sendCensusIndividual(cenInd);
    });

  }
}
