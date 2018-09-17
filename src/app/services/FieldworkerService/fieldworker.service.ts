import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {Fieldworker} from '../../models/fieldworker';
import {DatabaseService} from '../DatabaseService/database-service';
import {Events} from '@ionic/angular';
import {NetworkConfigurationService} from '../NetworkService/network-config';
import {SystemConfigService} from '../SystemService/system-config.service';
import {ErrorService} from '../ErrorService/error-service';

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class FieldworkerService extends DatabaseService {

  private db: OpenhdsDb;


  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigurationService,
              public errorsProvider: ErrorService, public systemConfig: SystemConfigService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const fw = await this.initProvider('fieldWorkers');
    fw.forEach(x => this.insert(x));
  }

  // Get all location in the database
  getAllFieldworkers() {
    return this.db.fieldworkers.toArray();
  }

   async getFieldworker(extId: string) {
    let fw;

    fw = await this.db.fieldworkers.where('extId').equals(extId).toArray();
    console.log(fw);
    return fw;
  }

  async saveDataLocally(fw: Fieldworker) {
    await this.insert(fw);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(fw: Fieldworker) {
    this.db.fieldworkers.add(fw).catch(err => console.log(err));
  }
}
