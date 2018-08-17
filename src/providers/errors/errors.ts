import { Injectable } from '@angular/core';
import {Errors} from "../../model/data-errors";
import {EntityErrorLabels} from "./entity-error-labels";
import {OpenhdsDb} from "../database-providers/openhds-db";

/*
  Generated class for the ErrorsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ErrorsProvider {
  private db: OpenhdsDb;
  constructor(){
    this.db = new OpenhdsDb();
  }

  async updateOrSetErrorStatus(error: Errors){
    if(await this.validateErrorExistence(error) == true)
      return await this.db.errors.update(error.uuid, error);
    else
      return await this.db.errors.add(error);
  }

  async getLocationErrors(): Promise<Errors[]>{
    return this.db.errors.where('entityType').equals(EntityErrorLabels.LOCATION_ERROR).toArray();
  }

  async validateErrorExistence(error: Errors){
    let err = await this.db.errors.filter(err => err.uuid == error.uuid).toArray();
    if(err[0] != null)
      return true;

    return false;
  }

  mapErrorMessage(code){
    if(code == 404){
      return "The data resource trying to be accessed was not found. Check URL for database."
    }

    return "An unknown error has occurred."
  }
}
