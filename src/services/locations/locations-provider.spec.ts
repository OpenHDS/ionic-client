import {getTestBed, TestBed} from "@angular/core/testing";
import {Events, MenuController, Platform} from "ionic-angular";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Injectable} from "@angular/core";
import {Network} from "@ionic-native/network";
import Dexie from "dexie";
import {Location} from "../../model/locations";
import {OpenhdsDb} from "../database-providers/openhds-db";
import {LocationsProvider} from "./locations-provider";
import {SystemConfigProvider} from "../system-config/system-config";
import {DatabaseProviders} from "../database-providers/database-providers"
import {FieldworkerProvider} from "../fieldworker/fieldworker";
import {NetworkConfigProvider} from "../network-config/network-config";
import {ErrorsProvider} from "../errors/errors";
import {UserProvider} from "../user-provider/user-provider";

export class MockOpenhdsDatabase extends OpenhdsDb {

}

export class MockDatabaseProviders extends DatabaseProviders {

}

@Injectable()
export class MockLocationsProvider extends LocationsProvider {
  constructor(public http: HttpClient, public userProvider: UserProvider,
              public systemConfig: SystemConfigProvider) {
    super(http, userProvider, systemConfig, );
    this.db = new MockOpenhdsDatabase();
  }
}

describe('Providers: Locations -- Getting, Saving Data', () => {
  let injector: TestBed;
  let mockLocationsProvider: MockLocationsProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockDatabaseProviders,
        MockLocationsProvider,
        UserProvider,
        SystemConfigProvider,
        FieldworkerProvider,
        ErrorsProvider,
        MenuController,
        NetworkConfigProvider,
        Network,
        Platform,
        Events,
      ]
    });

    injector = getTestBed();
    mockLocationsProvider = injector.get(MockLocationsProvider);
  });

  describe('Get Locations', () => {
    it('should return a empty array of Locations', async () => {
      mockLocationsProvider.getAllLocations().then((locations) => {
        expect(locations.length).toEqual(0)
      })
    });
  });

  describe("Create and Get Locations", () => {
    let location: Location = {
      "extId": "TEST000001",
      "locationName": "Test Location",
      "locationType": "RUR",
      "longitude": 45.67,
      "latitude": 67.45,
      "accuracy": null,
      "altitude": null,
      "collectedBy": "UNK",
      "locationLevel": null,
      "deleted": false,
      "insertDate": null,
      "clientInsert": null,
      "uuid": null,
      "processed": false, //false, if error or not approved, true otherwise.
      "errorReported": false,
      "selected": false,
    };

    it('should create a new location and save to database', async () => {
      await mockLocationsProvider.saveDataLocally(location).then( () => {
        expect().nothing(); //nothing returned database is initially empty
      });
    });

    it('should retrieve all given locations in the database.', async() =>{
      let entries = await mockLocationsProvider.getAllLocations();
      expect(entries.length).toBeGreaterThanOrEqual(1);
      expect(entries).toContain(location);
    });

    it('should throw an error when adding a location with the same external id', async() =>{
      await mockLocationsProvider.saveDataLocally(location).catch(err => expect(err).toBe("Location with given external Id already exists."));

    });

    Dexie.delete("OpenHDS") // Tests are done. Clean up Database.
  });
});
