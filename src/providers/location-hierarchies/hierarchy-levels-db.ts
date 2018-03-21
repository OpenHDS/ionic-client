import Dexie from 'dexie';

export class HierarchyLevelsDb extends Dexie {
  levels: Dexie.Table<HierarchyLevels, string>;

  constructor() {
    super("HierarchyLevels");
    this.version(1).stores({
      levels: 'extId, name, uuid, keyIdentifier'
    });
  }
}

export interface HierarchyLevels{
  extId: string;
  name: string;
  uuid: string;
  keyIdentifier: number
}
