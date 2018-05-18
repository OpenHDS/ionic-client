import {HierarchyLevels} from "./hierarchy-levels"

export interface Hierarchy
{
  extId: string;
  level: HierarchyLevels;
  parent: Hierarchy;
  name: string;
  uuid: string;
}
