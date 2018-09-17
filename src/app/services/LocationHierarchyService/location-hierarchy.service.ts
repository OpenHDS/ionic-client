import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {SystemConfigService} from '../SystemService/system-config.service';
import {HierarchyLevels} from '../../models/hierarchy-levels';
import {Hierarchy} from '../../models/hierarchy';


/*
  Generated class for the LocationHierarchiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class LocationHierarchyService extends DatabaseService {

    db: OpenhdsDb;

    constructor(public http: HttpClient, public systemConfig: SystemConfigService) {
        super(http, systemConfig);
        this.db = new OpenhdsDb();
    }

    async loadLevels() {
        let levels = await this.initProvider('locationhierarchylevels');
        levels.forEach(x => this.insertLevels(x));
    }

    async loadHierarchy() {
        let hier = await this.initProvider('locationHierarchies');
        hier.forEach(x => this.insertHierarchy(x));
    }

    getLevels(): Promise<HierarchyLevels[]> {
        return this.db.levels.toArray();
    }

    getHierarchy(): Promise<Hierarchy[]> {
        return this.db.locationhierarchies.toArray();
    }

    findHierarchy(extId): Hierarchy {
        return this.db.locationhierarchies.where('extId').equals(extId)[0];
    }
    // Abstract Updates and Adds to prevent errors
    async insertLevels(lev: HierarchyLevels) {
        this.db.levels.add(lev).catch(err => console.log(err));
    }

    async insertHierarchy(hierarchy: Hierarchy) {
        this.db.locationhierarchies.add(hierarchy).catch(err => console.log(err));
    }
}
