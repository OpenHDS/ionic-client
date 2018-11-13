import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UUID} from 'angular2-uuid';
import {Visit} from '../../models/visit';
import {SystemConfigService} from '../SystemService/system-config.service';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {ErrorService} from "../ErrorService/error-service";
import {FieldworkerService} from "../FieldworkerService/fieldworker.service";

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

  constructor(public http: HttpClient, public systemConfig: SystemConfigService, public fieldworkerService: FieldworkerService,
              public errorsService: ErrorService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const visits = await this.initProvider('visits');
    visits.forEach(x => this.insert(x));
  }

  async getAllVisits() {
    return await this.db.visits.toArray();
  }

  saveDataLocally(v: Visit) {
    if (!v.uuid) {
      v.uuid = UUID.UUID();
    }

    v.status = 'C';
    v.errorReported = false;
    v.syncedWithServer = false;
    v.processed = false;
    v.deleted = false;
    v.clientInsert = new Date().getTime();
    this.insert(v);
  }

  // Abstract Updates and Adds to prevent errors
  async insert(visit: Visit) {
    this.db.visits.add(visit).catch(err => console.log(err));
  }

  async update(visit: Visit) {
    this.db.visits.put(visit).catch(err => console.log(err));
  }


  async synchronizeOfflineVisits() {
    // Filter social groups for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const postOffline = await this.db.visits
      .filter(v => v.syncedWithServer === false && v.status === 'C' &&  v.processed === true &&  v.errorReported === false )
      .toArray();

    const shallowCopies = [];

    for(let i = 0; i < postOffline.length; i++){
      let shallow = await this.shallowCopy(postOffline[i]);
      shallowCopies.push(shallow);
    }

    if(shallowCopies.length > 0)
      await this.postData(shallowCopies);

    await this.db.visits
      .filter(v => v.syncedWithServer === false && v.status === 'C' &&  v.processed === true && v.errorReported === false)
      .modify({syncedWithServer: true});


    //Send updated data currently offline
    const updateOffline = await this.db.visits
      .filter(v => v.syncedWithServer === false && v.status === 'U' &&  v.processed === true  && v.errorReported === false).toArray();

    let updatedShallowCopies = [];

    for(let i = 0; i < updateOffline.length; i++){
      let shallow = await this.shallowCopy(updateOffline[i]);
      updatedShallowCopies.push(shallow);
    }

    if(updatedShallowCopies.length > 0)
      await this.updateData(updatedShallowCopies);

    await this.db.visits
      .filter(v => v.syncedWithServer === false && v.status === 'U' &&  v.processed === true  && v.errorReported === false)
      .modify({syncedWithServer: true});
  }


  async postData(visits: Array<Visit>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/visits2/bulkInsert';
    console.log("Sending " + visits.length + " visits to the server...");

    await this.http.post(url, {
      visits: visits,
      updateTimestamp: new Date().getTime()
    }, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let vis in data["errors"]){
          let id = data["errors"][vis].entityId;
          this.setErrorStatus(id);
        }

      this.errorsService.processErrors(data["errors"]);
    })
  }

  async updateData(visits: Array<Visit>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/visits2/bulkUpdate';
    console.log("Sending " + visits.length + " visits to the server...");

    await this.http.put(url, {
      visits: visits,
      updateTimestamp: new Date().getTime()
    }, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      if(data["errors"] != undefined)
        for(let vis in data["errors"]){
          console.log(data["errors"]);
          let id = data["errors"][vis].entityId;
          console.log(id);
          this.setErrorStatus(id);
        }

      this.errorsService.processErrors(data["errors"]);
    })
  }

  setErrorStatus(id){
    let v = this.db.visits.where('extId').equals(id).toArray();
    v[0]["errorReported"]= true;

    this.update(v[0]);
  }

  async shallowCopy(v) {
    const copy = new Visit();
    copy.extId = v.extId;
    const fieldworker = await this.fieldworkerService.getFieldworker(v.collectedBy);
    copy.collectedBy = {extId: fieldworker[0].extId};
    copy.roundNumber = v.roundNumber;
    copy.visitDate = v.visitDate;
    copy.visitLocation = {extId: v.visitLocation};
    return copy;
  }

}
