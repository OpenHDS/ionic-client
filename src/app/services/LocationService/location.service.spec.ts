import {inject, TestBed} from '@angular/core/testing';
import {LocationService} from './location.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Events, MenuController, Platform} from "@ionic/angular";
import Dexie from "dexie";

import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MockOpenhdsDatabase} from "../DatabaseService/openhds-db.service.spec";
import {FieldworkerService} from "../FieldworkerService/fieldworker.service";
import {LocationHierarchyService} from "../LocationHierarchyService/location-hierarchy.service";
import {SystemConfigService} from "../SystemService/system-config.service";
import {ErrorService} from "../ErrorService/error-service";
import {UserService} from "../UserService/user-service";
import {NetworkConfigurationService} from "../NetworkService/network-config";
import {Network} from "@ionic-native/network/ngx";
import {Injectable} from "@angular/core";


const dataGenUrl = "localhost:3000/api/locations";

@Injectable()
class MockLocationService extends LocationService {
  db: MockOpenhdsDatabase;

  constructor(public http: HttpClient, public event: Events, public fwProvider: FieldworkerService,
              public systemConfig: SystemConfigService, public locHierarchyService: LocationHierarchyService,
              public errorsService: ErrorService){
    super(http, event, fwProvider, systemConfig, locHierarchyService, errorsService);
    this.db = new MockOpenhdsDatabase();
  }
}

describe('LocationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        MockOpenhdsDatabase,
        MockLocationService,
        UserService,
        SystemConfigService,
        FieldworkerService,
        ErrorService,
        NetworkConfigurationService,
        Events,
        Network,
        Platform
      ]
    });
  });


  it('location service should be created', inject([MockLocationService], async (service: MockLocationService) => {
    expect(service).toBeTruthy();
  }));

});

Dexie.delete('OpenHDSMockDB'); // Tests are done. Clean up Database.


