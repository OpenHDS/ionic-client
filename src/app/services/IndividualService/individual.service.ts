import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
        await this.insert(ind);
    }

    async insert(ind: Individual) {
        this.db.individuals.add(ind).catch(err => console.log(err));
    }

    async update(ind: Individual) {
        this.db.individuals.put(ind).catch(err => console.log(err));
        this.censusProvider.updateCensusInformationForApproval(await this.shallowCopy(ind));
    }

    async shallowCopy(ind) {
        const copy = new Individual();
        copy.uuid = ind.uuid.replace(/-/g, '');
        copy.extId = ind.extId;
        const fieldworker = await this.fieldworkerProvider.getFieldworker(ind.collectedBy);
        copy.collectedBy =  {extId: fieldworker[0].extId, uuid: fieldworker[0].uuid};
        copy.firstName = ind.firstName;
        copy.middleName = ind.middleName;
        copy.lastName = ind.lastName;
        copy.gender = ind.gender;
        copy.dob = new Date(ind.dob).getTime();
        copy.dobAspect = ind.dobAspect;
        copy.mother = ind.mother != null ? ind.mother : this.getUnknownIndividual();
        copy.father = ind.father != null ? ind.father : this.getUnknownIndividual();

        return copy;
    }

    getUnknownIndividual() {
        return {extId: 'UNK'};
    }
}
