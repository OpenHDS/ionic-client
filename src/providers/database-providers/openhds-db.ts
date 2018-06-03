import Dexie from 'dexie';
import {SocialGroup} from "../../interfaces/social-groups";
import {HierarchyLevels} from "../../interfaces/hierarchy-levels";
import {Hierarchy} from "../../interfaces/hierarchy";
import {Fieldworker} from "../../interfaces/fieldworker";
import {Location} from "../../interfaces/locations";
import {Individual} from "../../interfaces/individual";
import {Errors} from "../../interfaces/data-errors";
import {CensusIndividual} from "../../interfaces/census-individual";
import {Visit} from "../../interfaces/visit";

export class OpenhdsDb extends Dexie {
  fieldworkers: Dexie.Table<Fieldworker, string>;
  levels: Dexie.Table<HierarchyLevels, string>;
  locationhierarchies: Dexie.Table<Hierarchy, string>;
  locations: Dexie.Table<Location, string>;
  socialGroup: Dexie.Table<SocialGroup, string>;
  individuals: Dexie.Table<Individual, string>;
  censusIndividuals: Dexie.Table<CensusIndividual, string>;
  visits: Dexie.Table<Visit, string>;
  errors: Dexie.Table<Errors, string>;

  constructor() {
    super("OpenHDS");
    this.version(1).stores({
      fieldworkers: 'uuid, extId, firstName, lastName, passwordHash, processed',
      levels: 'uuid, extId, name, keyIdentifier',
      locationhierarchies: 'uuid, extId, name, level, parent',
      locations: 'uuid, extId, name, type, longitude, latitude, deleted, insertDate, clientInsert, processed',
      socialGroup: 'uuid, extId, groupName, groupType, groupHead, deleted, insertDate, clientInsert, processed',
      individuals: 'uuid, extId, dob, dobAspect, firstName, middleName, lastName, gender, mother, father, bIsToA, deleted, insertDate',
      censusIndividuals: 'uuid, individual, locationExtId, socialGroupExtId, socialGroupHeadExtId, bIsToA, spouse, collectedBy',
      visits: 'uuid, extId, realVisit, roundNumber, visitDate, visitLocation, collectedBy',
      errors: 'uuid, entityType, entity, errorMessage, timestamp, resolved'
    });
  }
}

