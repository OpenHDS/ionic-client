import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CensusIndividual} from '../../models/census-individual';

import {Individual} from '../../models/individual';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {AuthService} from '../AuthService/auth.service';
import {SystemConfigService} from '../SystemService/system-config.service';


/*
  Generated class for the CensusSubmissionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class CensusSubmissionService {
  db: OpenhdsDb;

  constructor(public http: HttpClient, public fieldProvider: FieldworkerService,
              public authProvider: AuthService, public systemConfig: SystemConfigService) {
    this.db = new OpenhdsDb();
    console.log('Hello CensusSubmissionProvider Provider');
  }

  // TODO: Refactor and simplify census submission!
  sendCensusIndividual(censusInd: CensusIndividual) {
    const censusToServer = this.serverCopy(censusInd);
    console.log(censusToServer);
    const headers = new HttpHeaders().set('authorization',
      'Basic ' + btoa(this.systemConfig.getDefaultUser() + ':' + this.systemConfig.getDefaultPassword()));

    this.http.post(this.systemConfig.getServerURL() + '/census', censusToServer, {headers}).subscribe((x) => x, (err) => console.log(err));
  }

  serverCopy(censusInd) {
    const cenInd = new CensusIndividual();

    censusInd.uuid = censusInd.uuid.replace(/-/g, '');
    if (censusInd.individual.collectedBy == null) {
      censusInd.collectedBy = 'UNK';
      censusInd.individual.collectedBy = {extId: 'UNK', uuid: 'UnknownFieldWorker'};
    }

    censusInd.individual.uuid = censusInd.individual.uuid.replace(/-/g, '');
    if (censusInd.individual.mother == null) {
      censusInd.individual.mother = {extId: 'UNK', uuid: 'Unknown Individual'};
    }

    if (censusInd.individual.father == null) {
      censusInd.individual.father = {extId: 'UNK', uuid: 'Unknown Individual'};
    }

    // Copy over to fields needed for server, excluding information not needed (such as client error processing fields)
    cenInd.uuid = censusInd.uuid;
    cenInd.individual = censusInd.individual;
    cenInd.collectedBy = censusInd.collectedBy;
    cenInd.locationExtId = censusInd.locationExtId;
    cenInd.socialGroupExtId = censusInd.socialGroupExtId;
    cenInd.socialGroupHeadExtId = censusInd.socialGroupHeadExtId;
    cenInd.bIsToA = censusInd.bIsToA;
    cenInd.spouse = censusInd.spouse;

    return cenInd;
  }

  saveCensusInformationForApproval(censusInd: CensusIndividual) {
    censusInd.processed = false;
    this.db.censusIndividuals.add(censusInd).catch(err => console.log(err));
  }


  async updateCensusInformationForApproval(individual: Individual) {
    console.log('Updating census individual...');
    const lookup = await this.db.censusIndividuals.toArray();

    lookup.forEach(async x => {
      if (x.individual.extId == individual.extId) {
        x.individual = individual;

        // Update occured. Fix representation of individual.
        const fieldworker = await this.fieldProvider.getFieldworker(individual.collectedBy);
        x.individual.collectedBy = {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
        this.db.censusIndividuals.put(x);
      }
    });

  }
  async findCensusInformation(censusIndUuid: string) {
    const ind = await this.db.censusIndividuals.where('uuid').equals(censusIndUuid);
    return ind.toArray()[0];
  }

  removeApprovedAndSavedCensusData(censusInd: CensusIndividual) {
    this.db.censusIndividuals.delete(censusInd.individual.uuid).catch(err => console.log(err));
  }

  async getAllCensusSubmissions() {
    return await this.db.censusIndividuals.toArray();
  }
}
