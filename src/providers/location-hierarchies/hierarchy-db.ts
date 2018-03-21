import Dexie from 'dexie';
import {HierarchyLevels} from "./hierarchy-levels-db";

export class HierarchyDb extends Dexie {
  hierarchy: Dexie.Table<Hierarchy, string>;

  constructor() {
    super("Hierarchy");
    this.version(1).stores({
      hierarchy: 'extId, name, level, parent'
    });
  }
}

export interface Hierarchy{
  extId: string;
  level: HierarchyLevels;
  parent: Hierarchy;
  name: string;
  uuid: string;
}
