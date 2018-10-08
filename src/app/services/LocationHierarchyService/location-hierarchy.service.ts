import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DatabaseService} from '../DatabaseService/database-service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {SystemConfigService} from '../SystemService/system-config.service';
import {HierarchyLevel} from '../../models/hierarchy-level';
import {Hierarchy} from '../../models/hierarchy';
import {skip} from "rxjs/operators";


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

    async getLevels() {
        return await this.db.levels.toArray();
    }

    async getHierarchy() {
        return await this.db.locationhierarchies.toArray();
    }

    async findHierarchy(extId) {
        return await this.db.locationhierarchies.where('extId').equals(extId).toArray();
    }
    // Abstract Updates and Adds to prevent errors
    async insertLevels(lev: HierarchyLevel) {
        this.db.levels.add(lev).catch(err => console.log(err));
    }

    async insertHierarchy(hierarchy: Hierarchy) {
        this.db.locationhierarchies.add(hierarchy).catch(err => console.log(err));
    }

    async getLevelsInHierarchy(){
      return await this.db.levels.count();
    }

    async ascendHierarchy(startLevel, levelExt){
      let hierarchy = await this.getHierarchy();
      let ascendTo = startLevel;
      let levelCount = await this.getLevelsInHierarchy();
      let lookInto = [];
      hierarchy = hierarchy.filter(x => x.level.keyIdentifier === levelCount);
      console.log(hierarchy);
      for(let i = 0; i < hierarchy.length; i++){
        let parent = hierarchy[i].parent;

        //Ascend up to the startLevel
        for(let lvl = levelCount; lvl > ascendTo + 1; lvl--){
          parent = parent.parent;
          console.log(lvl + ": " + parent.extId)
        }

        if(parent.extId === levelExt){
          lookInto.push(hierarchy[i])
        }
      }

      return lookInto;
    }

}
