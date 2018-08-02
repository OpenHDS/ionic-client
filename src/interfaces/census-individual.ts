import {Individual} from "./individual";

export interface CensusIndividual {
  uuid?: string;
  socialGroupExtId?: string;
  socialGroupHeadExtId?: string;
  collectedBy?: string;
  locationExtId?: string;
  individual?: Individual;
  bIsToA?: string;
  spouse?: Individual;
  processed?: boolean;
  errorReported?: boolean;
}
