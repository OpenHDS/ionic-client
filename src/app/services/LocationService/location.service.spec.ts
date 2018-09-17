import {getTestBed, TestBed} from '@angular/core/testing';
import {Events, MenuController, Platform} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network';
import Dexie from 'dexie';
import {Location} from '../../models/locations';
import {LocationService} from './location.service';

import {DatabaseService} from '../DatabaseService/database-service';
import {UserService} from '../UserService/user-service';
import {SystemConfigService} from '../SystemService/system-config.service';
import {AuthService} from '../AuthService/auth.service';
import {OpenhdsDb} from '../DatabaseService/openhds-db';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {ErrorService} from '../ErrorService/error-service';
import {NetworkConfigurationService} from '../NetworkService/network-config';

export class MockOpenhdsDatabase extends OpenhdsDb {

}

export class MockDatabaseService extends DatabaseService {

}

@Injectable()
export class MockLocationService extends LocationService {
  constructor(public http: HttpClient, public fwService: FieldworkerService,
              public systemConfig: SystemConfigService, public authService: AuthService) {
    super(http, authService, fwService, systemConfig);
    this.db = new MockOpenhdsDatabase();
  }
}

describe('Providers: Locations -- Getting, Saving Data', () => {
  let injector: TestBed;
  let mockLocationService: MockLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockDatabaseService,
        MockLocationService,
        UserService,
        SystemConfigService,
        FieldworkerService,
        ErrorService,
        MenuController,
        NetworkConfigurationService,
        Network,
        Platform,
        Events,
      ]
    });

    injector = getTestBed();
    mockLocationService = injector.get(MockLocationService);
  });

  describe('Get Locations', () => {
    it('should return a empty array of Locations', async () => {
      mockLocationService.getAllLocations().then((locations) => {
        expect(locations.length).toEqual(0);
      });
    });
  });

  describe('Create and Get Locations', () => {
    const location: Location = {
      'extId': 'TEST000001',
      'locationName': 'Test Location',
      'locationType': 'RUR',
      'longitude': 45.67,
      'latitude': 67.45,
      'accuracy': null,
      'altitude': null,
      'collectedBy': 'UNK',
      'locationLevel': null,
      'deleted': false,
      'insertDate': null,
      'clientInsert': null,
      'uuid': null,
      'processed': false, // false, if error or not approved, true otherwise.
      'errorReported': false,
      'selected': false,
    };

    it('should create a new location and save to database', async () => {
      await mockLocationService.saveDataLocally(location).then( () => {
        expect().nothing(); // nothing returned database is initially empty
      });
    });

    it('should retrieve all given locations in the database.', async() => {
      const entries = await mockLocationService.getAllLocations();
      expect(entries.length).toBeGreaterThanOrEqual(1);
      expect(entries).toContain(location);
    });

    it('should throw an error when adding a location with the same external id', async() => {
      await mockLocationService.saveDataLocally(location).catch(err => expect(err)
          .toBe('Location with given external Id already exists.'));

    });

    Dexie.delete('openhdsTesting'); // Tests are done. Clean up Database.
  });
});
