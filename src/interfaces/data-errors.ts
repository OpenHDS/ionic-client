export interface Errors{
  uuid: string; //External id of the entity that caused the error
  entityType: number;
  entity: any;  // the entity object
  errorMessage: string; //the error message
  timestamp: number; //timestamp of when the error occurred.
  resolved: number; //0 for no, 1 for yes
}
