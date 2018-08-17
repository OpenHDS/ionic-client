import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {SocialGroup} from "../../model/social-groups";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {UserProvider} from "../user-provider/user-provider";
import {FieldworkerProvider} from "../fieldworker/fieldworker";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocialGroupProvider extends DatabaseProviders{

  private db: OpenhdsDb;

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider,
              public errorsProvider: ErrorsProvider, public fwProvider: FieldworkerProvider,
              public systemConfig: SystemConfigProvider, public userProvider: UserProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var sg = await this.initProvider("socialGroups");
    sg.forEach(x => this.insert(x));
  }

  //Get all social groups in the database
  getAllSocialGroups(){
    return this.db.socialGroup.toArray();
  }

  async saveDataLocally(sg: SocialGroup){
    sg.collectedBy = this.userProvider.getLoggedInUser();

    if(!sg.uuid)
      sg.uuid = UUID.UUID();

    sg.deleted = false;
    sg.syncedWithServer = false;
    sg.processed = false;
    sg.clientInsert = new Date().getTime();


    await this.insert(sg);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(sg: SocialGroup){
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async update(sg: SocialGroup){
    console.log("Updating SOCIAL GROUP...");
    this.db.socialGroup.put(sg).catch(err => console.log(err));
  }

  async synchronizeOfflineSocialGroups(){
    //Filter locations for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    var offline = await this.db.socialGroup
      .filter(sg => sg.syncedWithServer === false)
      .toArray();

    //Process and send data to server.
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

  async updateData(socialGrpData: SocialGroup){
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.systemConfig.getDefaultUser()+ ":" + this.systemConfig.getDefaultPassword()));

    const url = this.systemConfig.getServerURL() + "/socialgroups2/pushUpdates";
    let convertedSocialGroup = await this.serverCopy(socialGrpData);
    await this.http.put(url, {socialGroups:[convertedSocialGroup], timestamp: new Date().getTime()}, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data.toString());
      console.log("Update Successful");
    }, err => {
      throw "Updating failed...";
    });
  }

  async serverCopy(socialGrp){

    let sg = new SocialGroup();
    sg.uuid = socialGrp.uuid.replace(/-/g, "");  //Remove the dashes from the uuid.

    let fieldworker = await this.fwProvider.getFieldworker(socialGrp.collectedBy);
    sg.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    sg.extId = socialGrp.extId;
    sg.groupName = socialGrp.groupName;
    sg.groupType = socialGrp.groupType;
    sg.groupHead = {uuid: socialGrp.uuid, extId: socialGrp.groupHead.extId};
    return sg;
  }
}
