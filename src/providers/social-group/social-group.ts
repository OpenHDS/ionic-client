import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {SocialGroup} from "../../interfaces/social-groups";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocialGroupProvider extends DatabaseProviders{

  private db: OpenhdsDb;

  openhdsLogin = {
    username: 'admin',
    password: 'test'
  };

  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var sg = await this.initProvider("socialGroups");
    sg.forEach(x => this.insert(x));
  }

  //Get all location in the database
  getAllSocialGroups(){
    return this.db.socialGroup.toArray();
  }

  async saveDataLocally(sg: SocialGroup){
    sg.collectedBy = {
      extId: "FWEK1D"
    };

    if(!sg.uuid)
      sg.uuid = UUID.UUID();

    sg.deleted = false;
    sg.selected = false;
    sg.processed = 0;
    sg.clientInsert = new Date().getTime();

    await this.insert(sg);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(sg: SocialGroup){
    this.db.socialGroup.add(sg).catch(err => console.log(err));
  }
}
