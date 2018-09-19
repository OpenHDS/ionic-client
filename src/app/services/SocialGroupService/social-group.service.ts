import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SocialGroup} from '../../models/social-group';
import {UUID} from 'angular2-uuid';
import {Events} from '@ionic/angular';
import {DatabaseService} from '../DatabaseService/database-service';
import {NetworkConfigurationService} from '../NetworkService/network-config';
import {ErrorService} from '../ErrorService/error-service';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {IndividualService} from '../IndividualService/individual.service';
import {SystemConfigService} from '../SystemService/system-config.service';
import {AuthService} from '../AuthService/auth.service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({
    providedIn: 'root',
})
export class SocialGroupService extends DatabaseService {

  private db: OpenhdsDb;

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigurationService,
              public errorsProvider: ErrorService, public fwProvider: FieldworkerService,
              public individualProvider: IndividualService,
              public systemConfig: SystemConfigService, public authProvider: AuthService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const sg = await this.initProvider('socialGroups');
    sg.forEach(x => this.insert(x));
  }

  // Get all social groups in the database
  getAllSocialGroups() {
    return this.db.socialGroup.toArray();
  }

  async saveDataLocally(sg: SocialGroup) {
    sg.collectedBy = this.authProvider.getLoggedInUser();

    if (!sg.uuid) {
      sg.uuid = UUID.UUID();
    }
    sg.deleted = false;
    sg.syncedWithServer = false;
    sg.processed = false;
    sg.clientInsert = new Date().getTime();


    await this.insert(sg);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(sg: SocialGroup) {
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async update(sg: SocialGroup) {
    console.log('Updating SOCIAL GROUP...');
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async synchronizeOfflineSocialGroups() {
    console.log('Offline Social Group Sync');
    // Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const offline = await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false)
      .toArray();

    // Process and send data to server.
    await offline.forEach(async sg => {
      if (sg.processed) {
        await this.updateData(sg).then(() => {
          sg.syncedWithServer = true;
          this.update(sg);
        }).catch(() => {
          sg.syncedWithServer = false;
          sg.processed = false;
          this.update(sg);
        });
      }
    });
  }

  async updateData(socialGrpData: SocialGroup) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));

    const url = this.systemConfig.getServerURL() + '/socialgroups2/pushUpdates';
    const convertedSocialGroup = await this.serverCopy(socialGrpData);
    await this.http.put(url, {socialGroups: [convertedSocialGroup], timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data.toString());
      console.log('Update Successful');
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  async serverCopy(socialGrp) {
    const sg = new SocialGroup();
    sg.uuid = socialGrp.uuid.replace(/-/g, '');  // Remove the dashes from the uuid.
    const fieldworker = await this.fwProvider.getFieldworker(socialGrp.collectedBy);
    sg.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    sg.extId = socialGrp.extId;
    sg.groupName = socialGrp.groupName;
    sg.groupType = socialGrp.groupType;
    sg.groupHead = await this.individualProvider.shallowCopy(socialGrp.groupHead);
    return sg;
  }
}
