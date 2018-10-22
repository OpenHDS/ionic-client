export class DataError{
  uuid: string; // uuid id of the error record
  entityType: string;
  entityExtId: string;  // the entity object externalId for lookup
  errorMessage: string; // the error message
  timestamp: number; // timestamp of when the error occurred.
  resolved: boolean; // false for no, true for yes
}
