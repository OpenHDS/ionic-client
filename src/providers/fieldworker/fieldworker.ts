import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {Events} from "ionic-angular"
import {OpenhdsDb} from "../database-providers/openhds-db";
import {Fieldworker} from "../../interfaces/fieldworker";
import {DatabaseProviders} from "../database-providers/database-providers";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FieldworkerProvider extends DatabaseProviders{

  private db: OpenhdsDb;


  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var fw = await this.initProvider("fieldWorkers");
    fw.forEach(x => this.insert(x));
  }

  //Get all location in the database
  getAllFieldworkers(){
    return this.db.fieldworkers.toArray();
  }

   async getFieldworker(extId: string){
    var fw;

    fw = await this.db.fieldworkers.where("extId").equals(extId).toArray();
    console.log(fw);
    return fw;
  }

  async saveDataLocally(fw: Fieldworker){
    await this.insert(fw);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(fw: Fieldworker){
    this.db.fieldworkers.add(fw).catch(err => console.log(err));
  }
}
