import { Injectable } from '@angular/core';
import {OpenhdsDb} from "../DatabaseService/openhds-db";
import {SyncInfo} from "../../models/sync";
import {UUID} from "angular2-uuid";

@Injectable()
export class SyncInfoService {
  db: OpenhdsDb;
  constructor() {
    this.db = new OpenhdsDb();
  }

  insertSyncInfo(sync: SyncInfo){
    sync["uuid"] = UUID.UUID();
    this.db.sync.add(sync);
  }

  async findSyncInfo(entity){
    let syncs = await this.db.sync.where('entity').equals(entity).toArray();
    syncs.sort((a, b) => {
      return a.time - b.time
    });

    return syncs[syncs.length-1];
  }
}
