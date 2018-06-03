import {Fieldworker} from "./fieldworker";
import {Location} from "./locations";

export interface Visit {
  uuid: string;
  extId: string;
  realVisit: number;
  roundNumber: number;
  visitDate: Date;
  collectedBy: Fieldworker;
  visitLocation: Location;
}
