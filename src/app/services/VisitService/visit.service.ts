import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UUID} from 'angular2-uuid';
import {Visit} from '../../models/visit';
import {SystemConfigService} from '../SystemService/system-config.service';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';

/*
  Generated class for the VisitsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class VisitService extends DatabaseService {

  public db: OpenhdsDb;

  constructor(public http: HttpClient, public systemConfig: SystemConfigService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const visits = await this.initProvider('visits');
    visits.forEach(x => this.insert(x));
  }

  // Get all location in the database
  getAllVisits() {
    return this.db.visits.toArray();
  }

  saveDataLocally(v: Visit) {
    if (!v.uuid) {
      v.uuid = UUID.UUID();
    }

    v.processed = false;
    this.insert(v);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(visit: Visit) {
    this.db.visits.add(visit).catch(err => console.log(err));
  }

  async update(visit: Visit) {
    this.db.visits.put(visit).catch(err => console.log(err));
  }

}
