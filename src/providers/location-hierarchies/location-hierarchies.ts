import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SystemConfigProvider} from "../system-config/system-config";
import {HierarchyLevels} from "../../interfaces/hierarchy-levels";
import {Hierarchy} from "../../interfaces/hierarchy";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {DatabaseProviders} from "../database-providers/database-providers";
import {Fieldworker} from "../../interfaces/fieldworker";

/*
  Generated class for the LocationHierarchiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationHierarchiesProvider extends DatabaseProviders{

  db: OpenhdsDb;

  constructor(public http: HttpClient, public systemConfig: SystemConfigProvider) {
    super(http, systemConfig);
    this.db = new OpenhdsDb()
  }

  async loadLevels(){
    var levels = await this.initProvider("locationhierarchylevels");
    levels.forEach(x => this.insertLevels(x));
  }

  async loadHierarchy(){
    var hier = await this.initProvider("locationHierarchies");
    hier.forEach(x => this.insertHierarchy(x));
  }

  getLevels(): Promise<HierarchyLevels[]>{
    return this.db.levels.toArray();
  }

  getHierarchy(): Promise<Hierarchy[]>{
    return this.db.locationhierarchies.toArray();
  }

  //Abstract Updates and Adds to prevent errors
  async insertLevels(lev: HierarchyLevels){
    this.db.levels.add(lev).catch(err => console.log(err));
  }

  async insertHierarchy(hierarchy: Hierarchy){
    this.db.locationhierarchies.add(hierarchy).catch(err => console.log(err));
  }
}
