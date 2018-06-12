import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OpenHDSApp} from './app.component';
import { BaselineCensusPage } from "../pages/baseline-census/baseline-census";
import { LocationListPage } from "../pages/entity-lists/location-list";
import { LocationsProvider } from '../providers/locations/locations-provider';
import { HttpClientModule } from "@angular/common/http";
import { Network } from "@ionic-native/network";
import { NetworkConfigProvider } from "../providers/network-config/network-config";
import { CreateLocationPage } from "../pages/create-entities/create-location";
import { Geolocation } from "@ionic-native/geolocation";
import { ErrorsProvider } from '../providers/errors/errors';
import { ErrorDisplayPage } from "../pages/error-display/error-display";
import { SystemConfigProvider } from '../providers/system-config/system-config';
import { SystemConfigPage } from "../pages/system-config/system-config";
import {File} from "@ionic-native/file";
import { SupervisorModePage } from "../pages/supervisor-mode/supervisor-mode";
import { SynchronizeDbPage } from "../pages/synchronize-db/synchronize-db";
import { LocationHierarchiesProvider } from '../providers/location-hierarchies/location-hierarchies';
import {LocationHierarchyPage} from "../pages/entity-lists/location-hierarchy";
import { SocialGroupProvider } from '../providers/social-group/social-group';
import { IndividualProvider } from '../providers/individual/individual';
import {SocialGroupsPage} from "../pages/entity-lists/social-groups";
import {CreateSocialGroupPage} from "../pages/create-entities/create-sg";
import {CreateIndividualPage} from "../pages/create-entities/create-individual";
import {IndividualListPage} from "../pages/entity-lists/individual-list";
import { UserProvider } from '../providers/user-provider/user-provider';
import {LoginPage} from "../pages/login/login";
import { FieldworkerProvider } from '../providers/fieldworker/fieldworker';
import { DatabaseProviders } from '../providers/database-providers/database-providers';
import { CensusSubmissionProvider } from '../providers/census-submission/census-submission';
import {ApproveEntriesPage} from "../pages/approve-entries/approve-entries";
import { VisitsProvider } from '../providers/visits/visits';
import {CreateVisitPage} from "../pages/create-entities/create-visit";
import {SearchEntitiesPage} from "../pages/search-entities/search-entities";


@NgModule({
  declarations: [
    OpenHDSApp,
    BaselineCensusPage,
    LocationListPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage,
    SupervisorModePage,
    SynchronizeDbPage,
    LocationHierarchyPage,
    SocialGroupsPage,
    CreateSocialGroupPage,
    CreateIndividualPage,
    IndividualListPage,
    LoginPage,
    ApproveEntriesPage,
    CreateVisitPage,
    SearchEntitiesPage
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(OpenHDSApp)
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    OpenHDSApp,
    BaselineCensusPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage,
    SupervisorModePage,
    SynchronizeDbPage,
    LocationHierarchyPage,
    LocationListPage,
    SocialGroupsPage,
    CreateSocialGroupPage,
    CreateIndividualPage,
    IndividualListPage,
    LoginPage,
    ApproveEntriesPage,
    CreateVisitPage,
    SearchEntitiesPage
  ],

  providers: [
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
    UserProvider,
    FieldworkerProvider,
    DatabaseProviders,
    CensusSubmissionProvider,
    VisitsProvider
  ]
})

export class OpenHdsAppModule {}

