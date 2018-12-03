import {async, inject, TestBed} from '@angular/core/testing';
import {LocationService} from './location.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Events, Platform} from "@ionic/angular";

import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {MockOpenhdsDatabase} from "../DatabaseService/openhds-db.service.spec";
import {FieldworkerService} from "../FieldworkerService/fieldworker.service";
import {LocationHierarchyService} from "../LocationHierarchyService/location-hierarchy.service";
import {SystemConfigService} from "../SystemService/system-config.service";
import {ErrorService} from "../ErrorService/error-service";
import {UserService} from "../UserService/user-service";
import {NetworkConfigurationService} from "../NetworkService/network-config";
import {Network} from "@ionic-native/network/ngx";
import {Injectable} from "@angular/core";

//from needs to be used to convert dexie promises to observables for testing.
import {from} from "rxjs/internal/observable/from";
import Dexie from "dexie";


const dataGenUrl = "localhost:3000/api/";

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

@Injectable()
class DataGenerator{
  constructor(public http: HttpClient){
    console.log("Data Generator");
    this.http.get("localhost:3000/api/locations" + "/10",)

  }

  async getLocationData(url){
    const headers = new HttpHeaders();
    await this.http.get(url + "/10", {headers}).subscribe((x) => {
      console.log("NEXT");
      console.log(Object.keys(x));
    })
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
        HttpClient,
        DataGenerator,
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

  it('location service should be created', inject([MockLocationService],  (service: MockLocationService) => {
    expect(service).toBeTruthy();
  }));


  it('should call API and get a location then store in database', inject([DataGenerator, HttpTestingController, MockLocationService],
      (dg: DataGenerator, backend: HttpTestingController, service: MockLocationService) => {

    dg.getLocationData(dataGenUrl);

    }));

});
Dexie.delete("OpenHDSMockDB");
