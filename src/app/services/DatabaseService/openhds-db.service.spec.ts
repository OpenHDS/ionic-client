import {Hierarchy} from "../../models/hierarchy";
import {HierarchyLevel} from "../../models/hierarchy-level";
import {Location} from "../../models/location";
import Dexie from "dexie";
import {Fieldworker} from "../../models/fieldworker";
import {SocialGroup} from "../../models/social-group";
import {Individual} from "../../models/individual";
import {CensusIndividual} from "../../models/census-individual";
import {Visit} from "../../models/visit";
import {DataError} from "../../models/data-error";
import {User} from "../../models/user";

export class MockOpenhdsDatabase extends Dexie {
  fieldworkers: Dexie.Table<Fieldworker, string>;
  levels: Dexie.Table<HierarchyLevel, string>;
  locationhierarchies: Dexie.Table<Hierarchy, string>;
  locations: Dexie.Table<Location, string>;
  socialGroup: Dexie.Table<SocialGroup, string>;
  individuals: Dexie.Table<Individual, string>;
  censusIndividuals: Dexie.Table<CensusIndividual, string>;
  visits: Dexie.Table<Visit, string>;
  errors: Dexie.Table<DataError, string>;
  userCache: Dexie.Table<User, string>;

  constructor() {
    super('OpenHDSMockDB');
    this.version(1).stores({
      fieldworkers: 'uuid, extId, firstName, lastName, passwordHash, processed',
      levels: 'uuid, extId, name, keyIdentifier',
      locationhierarchies: 'uuid, extId, name, level, parent',
      locations: 'uuid, extId, name, type, longitude, latitude, deleted, insertDate, clientInsert, processed',
      socialGroup: 'uuid, extId, groupName, groupType, groupHead, deleted, insertDate, clientInsert, processed',
      individuals: 'uuid, extId, dob, dobAspect, firstName, middleName, lastName, gender, mother, father, bIsToA, deleted, insertDate',
      censusIndividuals: 'uuid, individual, locationExtId, socialGroupExtId, socialGroupHeadExtId, bIsToA, spouse, collectedBy',
      visits: 'uuid, extId, realVisit, roundNumber, visitDate, visitLocation, collectedBy',
      errors: 'uuid, entityType, entityId, errorMessage, timestamp, resolved',
      userCache: 'uuid, username, password, roles'
    });
  }
}
