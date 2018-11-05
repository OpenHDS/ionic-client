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
import {Hierarchy} from "../../models/hierarchy";
import {HierarchyLevel} from "../../models/hierarchy-level";
import {loadElementInternal} from "@angular/core/src/render3/util";
import {Location} from "../../models/location";

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
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async synchronizeOfflineSocialGroups() {
    // Filter social groups for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const offline = await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false)
      .toArray();

    const shallowCopies = [];

    for(let i = 0; i < offline.length; i++){
      let shallow = await this.shallowCopy(offline[i]);
      shallowCopies.push(shallow);
    }

    if(shallowCopies.length > 0)
      await this.updateData(shallowCopies);  }

  async updateData(socialGroupData: Array<SocialGroup>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/socialgroups2/bulkInsert';
    console.log("Sending " + socialGroupData.length + " social groups to the server...");

    await this.http.post(url, {socialGroups: socialGroupData, timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      console.log('Update Successful');
    }, err => {
      throw new Error('Updating failed...');
    });
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
