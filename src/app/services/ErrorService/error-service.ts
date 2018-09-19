import { Injectable } from '@angular/core';
import {DataError} from '../../models/data-error';
import {UUID} from 'angular2-uuid';
import {OpenhdsDb} from '../DatabaseService/openhds-db';

/*
  Generated class for the ErrorsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private db: OpenhdsDb;
  constructor() {
    this.db = new OpenhdsDb();
  }

  async updateOrSetErrorStatus(error: DataError) {
    if (await this.validateErrorExistence(error) === true) {
      return await this.db.errors.update(error.uuid, error);
    } else {
      return await this.db.errors.add(error);
    }
  }

  async getLocationErrors(): Promise<DataError[]> {
    return this.db.errors.where('entityType').equals('location').toArray();
  }

  async validateErrorExistence(error: DataError) {
    const err = await this.db.errors.filter(err => err.uuid == error.uuid).toArray();
    if (err[0] != null) {
      return true;
    }

    return false;
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

    err.resolved = false;
    err.timestamp = new Date().getTime();

    this.db.errors.add(err);
  }

}
