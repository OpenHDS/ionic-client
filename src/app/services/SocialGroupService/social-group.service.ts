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
import {LocationHierarchyService} from "../LocationHierarchyService/location-hierarchy.service";


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
              public errorsService: ErrorService, public fwProvider: FieldworkerService,
              public individualProvider: IndividualService, public locHierarchyService: LocationHierarchyService,
              public systemConfig: SystemConfigService, public authProvider: AuthService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const sg = await this.initProvider('socialGroups');
    sg.forEach(x => this.insert(x));
  }

  // Get all social groups in the database
  async getAllSocialGroups() {
    return await this.db.socialGroup.toArray();
  }

  async saveDataLocally(sg: SocialGroup) {

    if (!sg.uuid) {
      sg.uuid = UUID.UUID();
    }
    sg.status = 'C';
    sg.errorReported = false;
    sg.deleted = false;
    sg.syncedWithServer = false;
    sg.processed = false;
    sg.clientInsert = new Date().getTime();
    sg.insertDate = new Date();



    await this.insert(sg);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(sg: SocialGroup) {
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async update(sg: SocialGroup) {
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async synchronizeOfflineSocialGroups() {
    // Filter social groups for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const postOffline = await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false && sg.status === 'C' &&  sg.processed === true && sg.errorReported === false)
      .toArray();

    const shallowCopies = [];

    for(let i = 0; i < postOffline.length; i++){
      let shallow = await this.shallowCopy(postOffline[i]);
      shallowCopies.push(shallow);
    }

    if(shallowCopies.length > 0)
      await this.postData(shallowCopies);

    await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false && sg.status === 'C' &&  sg.processed === true &&  sg.errorReported === false )
      .modify({syncedWithServer: true});


    //Send updated data currently offline
    const updateOffline = await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false && sg.status === 'U' &&  sg.processed === true && sg.errorReported === false)
      .toArray();

    let updatedShallowCopies = [];

    for(let i = 0; i < updateOffline.length; i++){
      let shallow = await this.shallowCopy(updateOffline[i]);
      updatedShallowCopies.push(shallow);
    }

    if(updatedShallowCopies.length > 0)
      await this.updateData(updatedShallowCopies);

    await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false && sg.status === 'U' &&  sg.processed === true &&  sg.errorReported === false )
      .modify({syncedWithServer: true});
  }

  async postData(socialGroupData: Array<SocialGroup>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/socialgroups2/bulkInsert';
    console.log("Sending " + socialGroupData.length + " social groups to the server...");

    await this.http.post(url, {socialGroups: socialGroupData, timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let sg in data["errors"]){
          let id = data["errors"][sg].entityId;
          this.setErrorStatus(id);
        }

      this.errorsService.processErrors(data["errors"]);
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  async updateData(socialGroupData: Array<SocialGroup>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/socialgroups2/bulkUpdate';
    console.log("Sending " + socialGroupData.length + " social groups to the server...");

    await this.http.post(url, {socialGroups: socialGroupData, timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let sg in data["errors"]){
          let id = data["errors"][sg].entityId;
          this.setErrorStatus(id);
        }

      this.errorsService.processErrors(data["errors"]);
    }, err => {
      throw new Error('Updating failed...');
    });
  }

  setErrorStatus(id){
    let social = this.db.socialGroup.where('extId').equals(id).toArray();
    social[0]["errorReported"]= true;

    this.update(social[0]);
  }

  async shallowCopy(socialGrp) {
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

  async filterSocialGroupsByLocation(locExtId: string){
    let sgs = await this.getAllSocialGroups();
    return sgs.filter(sg => sg.extId.substring(0, locExtId.length) === locExtId);
  }

  async filterSocialGroupsByHierarchyLevel(levelIdentifier, levelExt){
    let sgs = await this.getAllSocialGroups();

    let validLocations = await this.locHierarchyService.ascendHierarchy(levelIdentifier, levelExt);

    let filtered = [];
    validLocations.forEach((loc) => {
      sgs.filter(x => x.extId.substring(0, loc.extId.length) === loc.extId)
        .forEach((sg) => filtered.push(sg))
    });

    return filtered;
  }

  async findSocialGroupByExtId(entityId){
    return await this.db.socialGroup.where('extId').equals(entityId).toArray()
  }
}
