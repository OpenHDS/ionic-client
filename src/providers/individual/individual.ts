import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {UUID} from "angular2-uuid";
import {Events} from "ionic-angular"
import {Individual} from "../../model/individual";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {CensusSubmissionProvider} from "../census-submission/census-submission";
import {FieldworkerProvider} from "../fieldworker/fieldworker";

/*
  Generated class for the SocialGroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IndividualProvider extends DatabaseProviders{

  private db: OpenhdsDb;


  constructor(public http: HttpClient, public ev: Events, public networkConfig: NetworkConfigProvider,
              public errorsProvider: ErrorsProvider, public fieldworkerProvider: FieldworkerProvider,
              public systemConfig: SystemConfigProvider, public censusProvider: CensusSubmissionProvider) {
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

  async findIndividualByExtId(extId: string){
    return await this.db.individuals.where("extId").equals(extId).toArray()[0];
  }

  async saveDataLocally(ind: Individual){
    if(!ind.uuid)
      ind.uuid = UUID.UUID().toString();

    ind.deleted = false;
    ind.processed = false;
    await this.insert(ind);
  }

  async insert(ind: Individual){
    this.db.individuals.add(ind).catch(err => console.log(err));
  }

  async update(ind: Individual){
    this.db.individuals.put(ind).catch(err => console.log(err));
    this.censusProvider.updateCensusInformationForApproval(await this.shallowCopy(ind));
  }

  async shallowCopy(ind){
    let copy = new Individual();
    copy.uuid = ind.uuid.replace(/-/g, "");
    copy.extId = ind.extId;
    let fieldworker = await this.fieldworkerProvider.getFieldworker(ind.collectedBy);
    copy.collectedBy =  {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
    copy.firstName = ind.firstName;
    copy.middleName = ind.middleName;
    copy.lastName = ind.lastName;
    copy.gender = ind.gender;
    copy.dob = new Date(ind.dob).getTime();
    copy.dobAspect = ind.dobAspect;
    copy.mother = ind.mother != null ? ind.mother: this.getUnknownIndividual();
    copy.father = ind.father != null ? ind.father: this.getUnknownIndividual();

    return copy;
  }

  getUnknownIndividual(){
    return {extId: "UNK"};
  }
}
