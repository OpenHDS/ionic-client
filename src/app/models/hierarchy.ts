import {HierarchyLevels} from './hierarchy-levels';

export class Hierarchy {
  extId: string;
  level: HierarchyLevels;
  parent: Hierarchy;
  name: string;
  uuid: string;
}
