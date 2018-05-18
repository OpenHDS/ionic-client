import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {Individual} from "../../interfaces/individual";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndividualProvider extends DatabaseProviders{

  private db: OpenhdsDb;


  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider, public errorsProvider: ErrorsProvider,
              public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData(){
    var ind = await this.initProvider("individuals");
    ind.forEach(x => this.insert(x));
  }

  //Get all location in the database
  getAllIndividuals(){
    return this.db.individuals.toArray();
  }

  async saveDataLocally(ind: Individual){
    ind.collectedBy = {
      extId: "FWEK1D"
    };

    if(!ind.uuid)
      ind.uuid = UUID.UUID();

    ind.deleted = false;
    ind.selected = false;
    ind.processed = 0;
    ind.clientInsert = new Date().getTime();

    await this.insert(ind);
  }

  //Abstract Updates and Adds to prevent errors
  async insert(ind: Individual){
    this.db.individuals.add(ind).catch(err => console.log(err));
  }
}
