import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from "../locations/locations-db";
import {ErrorsDb, Errors} from "./errors-db";
import {EntityErrorLabels} from "./entity-error-labels";

/*
  Generated class for the ErrorsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ErrorsProvider {
  private errorDb: ErrorsDb;
  constructor(){
    this.errorDb = new ErrorsDb();
  }

  async updateOrSetErrorStatus(error: Errors){
    if(await this.validateErrorExistence(error) == true)
      return await this.errorDb.errors.update(error.uuid, error);
    else
      return await this.errorDb.errors.add(error);
  }

  async getLocationErrors(): Promise<Errors[]>{
    return this.errorDb.errors.where('entityType').equals(EntityErrorLabels.LOCATION_ERROR).toArray();
  }

  async validateErrorExistence(error: Errors){
    let err = await this.errorDb.errors.filter(err => err.uuid == error.uuid).toArray();
    if(err[0] != null)
      return true;

    return false;
  }
}
