import Dexie from 'dexie';

export class FieldworkerDb extends Dexie {
  fieldworker: Dexie.Table<Fieldworker, string>;

  constructor() {
    super("Fieldworker");
    this.version(1).stores({
      fieldworker: 'extId, uuid, firstName, lastName, passwordHash, processed'
    });
  }
}

export interface Fieldworker{
  extId: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  uuid: string;
  processed: number; //0 for not sent, 1 for sent, 2 for sent, but with error
}
