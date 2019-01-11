import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {Network} from '@ionic-native/network/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ComponentsModule} from "./components/components";
import {LocationService} from "./services/LocationService/location.service";
import {IndividualService} from "./services/IndividualService/individual.service";
import {LocationHierarchyService} from "./services/LocationHierarchyService/location-hierarchy.service";
import {SocialGroupService} from "./services/SocialGroupService/social-group.service";
import {CensusSubmissionService} from "./services/CensusSubmissionService/census-submission.service";
import {FieldworkerService} from "./services/FieldworkerService/fieldworker.service";
import {SynchonizationObservableService} from "./services/SynchonizationObserverable/synchonization-observable.service";
import {VisitService} from "./services/VisitService/visit.service";

import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {SyncInfoService} from "./services/SyncInfoService/sync-info.service";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ComponentsModule, BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    Network,
    Geolocation,
    SplashScreen,
    SynchonizationObservableService,
    FieldworkerService,
    LocationHierarchyService,
    LocationService,
    SocialGroupService,
    SyncInfoService,
    IndividualService,
    VisitService,
    CensusSubmissionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
