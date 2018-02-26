import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { BaselineCensusPage } from "../pages/baseline-census/baseline-census";
import { LocationListPage } from "../pages/location-list/location-list";
import { LocationsProvider } from '../providers/locations/locations-provider';
import { HttpClientModule } from "@angular/common/http";
import { Network } from "@ionic-native/network";
import { NetworkConfigProvider } from "../providers/network-config/network-config";
import { CreateLocationPage } from "../pages/create-location/create-location";
import { Geolocation } from "@ionic-native/geolocation";
import { ErrorsProvider } from '../providers/errors/errors';
import { MenuPage } from "../pages/menu/menu";
import { ErrorDisplayPage } from "../pages/error-display/error-display";
import { SystemConfigProvider } from '../providers/system-config/system-config';
import {SystemConfigPage} from "../pages/system-config/system-config";

@NgModule({
  declarations: [
    MyApp,
    MenuPage,
    BaselineCensusPage,
    LocationListPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    BaselineCensusPage,
    CreateLocationPage,
    ErrorDisplayPage,
    SystemConfigPage
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
    SystemConfigProvider
  ]
})
export class AppModule {}
