import {HierarchyLevel} from './hierarchy-level';

export class Hierarchy {
  extId: string;
  level: HierarchyLevel;
  parent: Hierarchy;
  name: string;
  uuid: string;
}
