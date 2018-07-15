import {Fieldworker} from "./fieldworker";
import {Individual} from "./individual";

export interface CensusIndividual {
  uuid?: string;
  socialGroupExtId?: string;
  socialGroupHeadExtId?: string;
  collectedBy?: Fieldworker;
  locationExtId?: string;
  individual?: Individual;
  bIsToA?: string;
  spouse?: Individual;
}
