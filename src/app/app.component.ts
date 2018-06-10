import { Component, ViewChild } from '@angular/core';

import {App, Events, MenuController, Nav, Platform} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {BaselineCensusPage} from "../pages/baseline-census/baseline-census";
import {LoginPage} from "../pages/login/login";
import {UserProvider} from "../providers/user-provider/user-provider";
import {SupervisorModePage} from "../pages/supervisor-mode/supervisor-mode";
import {SynchronizeDbPage} from "../pages/synchronize-db/synchronize-db";
import {ApproveEntriesPage} from "../pages/approve-entries/approve-entries";
import {SystemConfigPage} from "../pages/system-config/system-config";
import {SearchEntitiesPage} from "../pages/search-entities/search-entities";

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon?: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  selector: `ion-app`,
  templateUrl: 'app.html'
})
export class OpenHDSApp {
  @ViewChild(Nav) nav: Nav

  fieldworkerPages: PageInterface[] = [
    { title: 'Dashboard', name: 'DashboardPage', component: BaselineCensusPage },
    { title: 'Baseline Census', name: 'BaselineCensusPage', component: BaselineCensusPage},
    { title: 'Search For a Record', name: 'SearchEntitiesPage', component: SearchEntitiesPage},
  ];
  adminPages: PageInterface[] = [
    { title: 'Dashboard', name: 'AdminDashboardPage', component: SupervisorModePage},
    { title: 'Baseline Census', name: 'BaselineCensusPage', component: BaselineCensusPage},
    { title: 'Search For a Record', name: 'SearchEntitiesPage', component: SearchEntitiesPage},
    { title: 'Synchronization', name: 'SynchronizeDbPage', component: SynchronizeDbPage},
    { title: 'Data Entry Approval', name: 'ApproveEntriesPage', component: ApproveEntriesPage},
    { title: 'System Configurations', name: 'SystemConfigPage', component: SystemConfigPage},
  ];

  rootPage: any;

  constructor( public events: Events,  public platform: Platform, public splashScreen: SplashScreen,
               public userData: UserProvider, public appCtrl: App) {

    if(this.userData.hasLoggedIn()){
      this.rootPage = BaselineCensusPage;
    } else {
      this.rootPage = LoginPage;
    }

    this.platformReady();
  }

  openPage(page){
    this.appCtrl.getRootNav().push(page.component);
  }

  logoutUser() {
    this.appCtrl.getRootNav().setRoot(LoginPage, {canSwipeBack: false});
    this.userData.setUserLogout();
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {

    });
  }
}
