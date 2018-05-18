import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { BaselineCensusPage } from "../pages/baseline-census/baseline-census";
import { LocationListPage } from "../pages/entity-lists/location-list";
import { LocationsProvider } from '../providers/locations/locations-provider';
import { HttpClientModule } from "@angular/common/http";
import { Network } from "@ionic-native/network";
import { NetworkConfigProvider } from "../providers/network-config/network-config";
import { CreateLocationPage } from "../pages/create-entities/create-location";
import { Geolocation } from "@ionic-native/geolocation";
import { ErrorsProvider } from '../providers/errors/errors';
import { FieldworkerMenuPage } from "../pages/fieldworker-menu/menu";
import { ErrorDisplayPage } from "../pages/error-display/error-display";
import { SystemConfigProvider } from '../providers/system-config/system-config';
import { SystemConfigPage } from "../pages/system-config/system-config";
import {File} from "@ionic-native/file";
import { SupervisorModePage } from "../pages/supervisor-mode/supervisor-mode";
import { SynchronizeDbPage } from "../pages/synchronize-db/synchronize-db";
import { SupervisorMenuPage} from "../pages/supervisor-menu/supervisor-menu";
import { LocationHierarchiesProvider } from '../providers/location-hierarchies/location-hierarchies';
import {LocationHierarchyPage} from "../pages/entity-lists/location-hierarchy";
import { SocialGroupProvider } from '../providers/social-group/social-group';
import { IndividualProvider } from '../providers/individual/individual';
import {SocialGroupsPage} from "../pages/entity-lists/social-groups";
import {CreateSocialGroupPage} from "../pages/create-entities/create-sg";
import {CreateIndividualPage} from "../pages/create-entities/create-individual";
import {IndividualListPage} from "../pages/entity-lists/individual-list";
import { LoginProvider } from '../providers/login/login';
import {LoginPage} from "../pages/login/login";
import { FieldworkerProvider } from '../providers/fieldworker/fieldworker';
import { DatabaseProvidersProvider } from '../providers/database-providers/database-providers';

@NgModule({
  declarations: [
    MyApp,
    FieldworkerMenuPage,
    BaselineCensusPage,
    LocationListPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage,
    SupervisorModePage,
    SupervisorMenuPage,
    SynchronizeDbPage,
    LocationHierarchyPage,
    SocialGroupsPage,
    CreateSocialGroupPage,
    CreateIndividualPage,
    IndividualListPage,
    LoginPage
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FieldworkerMenuPage,
    BaselineCensusPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage,
    SupervisorModePage,
    SupervisorMenuPage,
    SynchronizeDbPage,
    LocationHierarchyPage,
    LocationListPage,
    SocialGroupsPage,
    CreateSocialGroupPage,
    CreateIndividualPage,
    IndividualListPage, LoginPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    Geolocation,
    NetworkConfigProvider,
    LocationsProvider,
    ErrorsProvider,
    SystemConfigProvider,
    File,
    LocationHierarchiesProvider,
    SocialGroupProvider,
    IndividualProvider,
    LoginProvider,
    FieldworkerProvider,
    DatabaseProvidersProvider
  ]
})

export class AppModule {}

