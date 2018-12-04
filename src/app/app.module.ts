import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
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

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ComponentsModule, BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule],
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
    IndividualService,
    VisitService,
    CensusSubmissionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
