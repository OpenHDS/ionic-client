import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CensusIndividual} from "../../interfaces/census-individual";
import {SystemConfigProvider} from "../system-config/system-config";
import {OpenhdsDb} from "../database-providers/openhds-db";

/*
  Generated class for the CensusSubmissionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CensusSubmissionProvider {
  db: OpenhdsDb;

  constructor(public http: HttpClient, public systemConfig: SystemConfigProvider) {
    this.db = new OpenhdsDb();
    console.log('Hello CensusSubmissionProvider Provider');
  }

  //TODO: Refactor and simplify census submission!
  sendCensusIndividual(censusInd: CensusIndividual) {

    //Transform specific data to format for submission to server.
    censusInd.uuid = censusInd.uuid.replace(/-/g, "");
    if (censusInd.individual.collectedBy == null) {
      censusInd.collectedBy = {extId: "UNK", uuid: "UnknownFieldWorker"};
      censusInd.individual.collectedBy = {extId: "UNK", uuid: "UnknownFieldWorker"};
    } else {
      censusInd.collectedBy = {extId: censusInd.collectedBy.extId, uuid: censusInd.collectedBy.uuid}
      censusInd.individual.collectedBy = {extId: censusInd.collectedBy.extId, uuid: censusInd.collectedBy.uuid}

    }

    censusInd.individual.uuid = censusInd.individual.uuid.replace(/-/g, "");
    if (censusInd.individual.mother == null) {
      censusInd.individual.mother = {extId: "UNK", uuid: "Unknown Individual"}
    }

    if (censusInd.individual.father == null) {
      censusInd.individual.father = {extId: "UNK", uuid: "Unknown Individual"}
    }

    console.log(censusInd);
    const headers = new HttpHeaders().set('authorization',
      "Basic " + btoa(this.systemConfig.getDefaultUser() + ":" + this.systemConfig.getDefaultPassword()));

    this.http.post(this.systemConfig.getServerURL() + "/census", censusInd, {headers}).subscribe((x) => x, (err) => console.log(err));
  }

  saveCensusInformationForApproval(censusInd: CensusIndividual){
    this.db.censusIndividuals.add(censusInd).catch(err => console.log(err));
  }

  async findCensusInformation(censusIndUuid: string){
    var ind = await this.db.censusIndividuals.where("uuid").equals(censusIndUuid);
    return ind.toArray()[0];
  }

  removeApprovedAndSavedCensusData(censusInd: CensusIndividual){
    this.db.censusIndividuals.delete(censusInd.individual.uuid).catch(err => console.log(err));
  }

  async getAllCensusSubmissions(){
    return await this.db.censusIndividuals.toArray();
  }
}
