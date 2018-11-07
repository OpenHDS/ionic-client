import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Events} from '@ionic/angular';
import {NetworkConfigurationService} from '../NetworkService/network-config';
import {ErrorService} from '../ErrorService/error-service';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {SystemConfigService} from '../SystemService/system-config.service';
import {CensusSubmissionService} from '../CensusSubmissionService/census-submission.service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {DatabaseService} from '../DatabaseService/database-service';
import {Individual} from '../../models/individual';
import {UUID} from 'angular2-uuid';
import {CensusIndividual} from "../../models/census-individual";


@Injectable({
  providedIn: 'root'
})
export class IndividualService extends DatabaseService {

  private db: OpenhdsDb;


  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigurationService,
              public errorsProvider: ErrorService, public fieldworkerProvider: FieldworkerService,
              public systemConfig: SystemConfigService, public censusProvider: CensusSubmissionService) {
    super(http, systemConfig);
    this.db = new OpenhdsDb();
  }

  async loadInitData() {
    const ind = await this.initProvider('individuals');
    ind.forEach(x => this.insert(x));
  }

  // Get all location in the database
  getAllIndividuals() {
    return this.db.individuals.toArray();
  }

  async findIndividualByExtId(extId: string) {
    return await this.db.individuals.where('extId').equals(extId).toArray();
  }

  async saveDataLocally(ind: Individual) {
    if (!ind.uuid) {
      ind.uuid = UUID.UUID().toString();
    }

    ind.deleted = false;
    ind.processed = false;
    ind.syncedWithServer = false;
    await this.insert(ind);
  }

  async insert(ind: Individual) {
    this.db.individuals.add(ind).catch(err => console.log(err));
  }

  async update(ind: Individual) {
    console.log(ind);
    this.db.individuals.put(ind).catch(err => console.log(err));
    this.censusProvider.updateCensusInformationForApproval(await this.shallowCopy(ind));
  }

  async synchronizeOfflineIndividuals() {
    console.log("Synchonizing offline individuals...");
    // Filter social groups for ones inserted in offline mode, or ones that have been updated (changed values, fixes to errors, ect.)
    const offline = await this.db.censusIndividuals
      .filter(ind => ind.syncedWithServer == false)
      .toArray();

    const shallowCopies = [];

    for (let i = 0; i < offline.length; i++) {
      let shallow = await this.shallowCensusCopy(offline[i]);
      shallowCopies.push(shallow);
    }

    console.log(shallowCopies);
    if (shallowCopies.length > 0)
      await this.updateData(shallowCopies);
  }

  async updateData(censusIndData: Array<CensusIndividual>) {
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));


    const url = this.systemConfig.getServerURL() + '/census/bulkInsert';
    console.log("Sending " + censusIndData.length + " individuals to the server...");

    await this.http.post(url, {
      individuals: censusIndData,
      updateTimestamp: new Date().getTime()
    }, {headers}).subscribe(data => {
      localStorage.setItem('lastUpdate', data["syncTime"].toString());
      console.log(data["errors"])
    })
  }

  async shallowCensusCopy(censusInd) {
    const cenInd = {};
    console.log(censusInd);
    cenInd["individual"] = await this.shallowCopy(censusInd.individual);
    cenInd["collectedBy"] = {"extId": censusInd.collectedBy};
    cenInd["location"] = {"extId": censusInd.locationExtId};
    cenInd["socialGroup"] = {"extId": censusInd.socialGroupExtId};
    cenInd["bIsToA"] = censusInd.bIsToA;
    cenInd["spouse"] = censusInd.spouse !== undefined ? this.shallowCopy(censusInd.spouse) : null;

    return cenInd;
  }

  async shallowCopy(ind) {
    const copy = new Individual();
    copy.extId = ind.extId;
    const fieldworker = await this.fieldworkerProvider.getFieldworker(ind.collectedBy);
    copy.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    copy.firstName = ind.firstName;
    copy.middleName = ind.middleName;
    copy.lastName = ind.lastName;
    copy.gender = ind.gender;
    copy.dob = new Date(ind.dob).getTime();
    copy.dobAspect = ind.dobAspect;
    copy.mother = ind.mother != null ? {extId: ind.mother.extId} : this.getUnknownIndividual();
    copy.father = ind.father != null ? {extId: ind.father.extId} : this.getUnknownIndividual();

    return copy;
  }

  getUnknownIndividual() {
    return {extId: 'UNK'};
  }
}
