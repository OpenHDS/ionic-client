import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UUID} from "angular2-uuid";
import {DatabaseProviders} from "../database-providers/database-providers";
import {SystemConfigProvider} from "../system-config/system-config";
import {Visit} from "../../interfaces/visit";
import {OpenhdsDb} from "../database-providers/openhds-db";

/*
  Generated class for the VisitsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VisitsProvider extends DatabaseProviders {

  public db: OpenhdsDb;

  constructor(public http: HttpClient, public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var visits = await this.initProvider("visits");
    visits.forEach(x => this.insert(x));
  }

  //Get all location in the database
  getAllVisits(){
    return this.db.visits.toArray();
  }

  saveDataLocally(v: Visit){
    if(!v.uuid)
      v.uuid = UUID.UUID();
    this.insert(v);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(visit: Visit){
    this.db.visits.add(visit).catch(err => console.log(err));
  }

}
