import { Injectable } from '@angular/core';
import {DataError} from '../../models/data-error';
import {UUID} from 'angular2-uuid';
import {OpenhdsDb} from '../DatabaseService/openhds-db';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private db: OpenhdsDb;
  constructor() {
    this.db = new OpenhdsDb();
  }

  async updateOrAddError(error: DataError) {
    if (await this.validateErrorExistence(error) === true) {
      return await this.db.errors.put(error);
    } else {
      error["resolved"] = false;
      return await this.db.errors.add(error);
    }
  }


  async groupEntityErrorsByIds(labelName){
    let errors = await this.db.errors.where('entityType').equals(labelName).toArray();
    let groups = {};
    errors.forEach(x => {
      if (groups.hasOwnProperty(x.entityId))
        groups[x.entityId].push({errorMessage: x.errorMessage, timestamp: x.timestamp});
      else
        groups[x.entityId] = [{errorMessage: x.errorMessage, timestamp: x.timestamp}];
    });

    return groups;
  }

  async validateErrorExistence(error: DataError) {
    const err = await this.db.errors.filter(err => err.uuid == error.uuid).toArray();
    if (err[0] != null) {
      return true;
    }

    return false;
  }

  async findAndMarkResolved(entityId){
    console.log("Marking resolved... " + entityId);
    let entity = await this.db.errors.where('entityId').equals(entityId).toArray();
    console.log(entity);
    entity[0]["resolved"] = true;
    await this.updateOrAddError(entity[0]);
  }

  mapErrorMessage(code) {
    if (code === 404) {
      return 'The data resource trying to be accessed was not found. Check URL for database.';
    }

    return 'An unknown error has occurred.';
  }

  saveError(err: DataError) {
    if (!err.uuid) {
      err.uuid = UUID.UUID();
    }

    err["resolved"] = false;
    err.timestamp = new Date().getTime();
    this.updateOrAddError(err);
  }

}
