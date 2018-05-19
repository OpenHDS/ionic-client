import {Fieldworker} from "./fieldworker";
import {Individual} from "./individual";

export class CensusIndividual {
  socialGroupExtId: string;
  collectedBy: Fieldworker;
  locationExtId: string;
  individual: Individual;
  bIsToA: string;
  spouse: Individual;
}
