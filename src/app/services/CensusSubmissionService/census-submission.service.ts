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



  saveCensusInformationForApproval(censusInd: CensusIndividual) {
    censusInd.processed = false;
    censusInd.syncedWithServer = false;
    this.db.censusIndividuals.add(censusInd).catch(err => console.log(err));
  }


  async updateCensusInformationForApproval(individual: Individual) {
    console.log('Updating census individual...');
    const lookup = await this.db.censusIndividuals.toArray();

    lookup.forEach(async x => {
      if (x.individual.extId === individual.extId) {
        x.individual = individual;

        // Update occured. Fix representation of individual.
        x.individual.collectedBy = x.individual.collectedBy.extId;
        x.individual.syncedWithServer = false;
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
