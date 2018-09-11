import Dexie from 'dexie';
import {SocialGroup} from "../../model/social-groups";
import {HierarchyLevels} from "../../model/hierarchy-levels";
import {Hierarchy} from "../../model/hierarchy";
import {Fieldworker} from "../../model/fieldworker";
import {Location} from "../../model/locations";
import {Individual} from "../../model/individual";
import {DataError} from "../../model/data-errors";
import {CensusIndividual} from "../../model/census-individual";
import {Visit} from "../../model/visit";
import {User} from "../../model/user";

export class OpenhdsDb extends Dexie {
  fieldworkers: Dexie.Table<Fieldworker, string>;
  levels: Dexie.Table<HierarchyLevels, string>;
  locationhierarchies: Dexie.Table<Hierarchy, string>;
  locations: Dexie.Table<Location, string>;
  socialGroup: Dexie.Table<SocialGroup, string>;
  individuals: Dexie.Table<Individual, string>;
  censusIndividuals: Dexie.Table<CensusIndividual, string>;
  visits: Dexie.Table<Visit, string>;
  errors: Dexie.Table<DataError, string>;
  userCache: Dexie.Table<User, string>;

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
      errors: 'uuid, entityType, entity, errorMessage, timestamp, resolved',
      userCache: 'uuid, username, password, roles'
    });
  }
}

