import {Individual} from './individual';

export class CensusIndividual {
  uuid?: string;
  socialGroupExtId?: string;
  socialGroupHeadExtId?: string;
  collectedBy?: any;
  locationExtId?: string;
  individual?: Individual;
  bIsToA?: string;
  spouse?: Individual;
  processed?: boolean;
  errorReported?: boolean;
  syncedWithServer?: boolean;
}
