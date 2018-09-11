import { Component, ViewChild } from '@angular/core';

import {App, Events,  Nav, Platform} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {BaselineCensusPage} from "../pages/baseline-census/baseline-census";
import {LoginPage} from "../pages/login/login";
import {SupervisorModePage} from "../pages/supervisor-mode/supervisor-mode";
import {SynchronizeDbPage} from "../pages/synchronize-db/synchronize-db";
import {ApproveEntriesPage} from "../pages/admin-approval/entry-approval/approve-entries";
import {SystemConfigPage} from "../pages/system-config/system-config";
import {SearchEntitiesPage} from "../pages/search/search-by-entity/search-entities";
import {FieldworkerModePage} from "../pages/fieldworker-mode/fieldworker-mode";
import {LoginProvider} from "../providers/login/login";

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
  @ViewChild(Nav) nav: Nav;

  fieldworkerPages: PageInterface[] = [
    { title: 'Dashboard', name: 'DashboardPage', component: FieldworkerModePage },
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
               public loginProvider: LoginProvider, public appCtrl: App) {

    if(this.loginProvider.hasLoggedIn() == false || this.loginProvider.getLoggedInUser() == null){
      this.rootPage = LoginPage;
    } else if(this.loginProvider.getLoggedInUser() == 'admin'){
      this.rootPage = SupervisorModePage;
      this.loginProvider.enableUserMenu();
    } else {
      this.rootPage = FieldworkerModePage;
      this.loginProvider.enableUserMenu();
    }


    this.platformReady();
  }

  ionViewWillEnter() {

  }

  openPage(page){
    this.nav.push(page.component);
  }

  logoutUser() {
    this.appCtrl.getRootNav().setRoot(LoginPage);
    this.loginProvider.setUserLogout();
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {

    });
  }
}
