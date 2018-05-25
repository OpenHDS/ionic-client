import { Component, ViewChild } from '@angular/core';

import {App, Events, MenuController, Nav, Platform} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {BaselineCensusPage} from "../pages/baseline-census/baseline-census";
import {LoginPage} from "../pages/login/login";
import {UserProvider} from "../providers/user-provider/user-provider";
import {SupervisorModePage} from "../pages/supervisor-mode/supervisor-mode";
import {SynchronizeDbPage} from "../pages/synchronize-db/synchronize-db";
import {ApproveEntriesPage} from "../pages/approve-entries/approve-entries";

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
  templateUrl: 'app.html'
})
export class OpenHDSApp {
  @ViewChild(Nav) nav: Nav

  fieldworkerPages: PageInterface[] = [
    { title: 'Dashboard', name: 'DashboardPage', component: BaselineCensusPage },
    { title: 'Baseline Census', name: 'BaselineCensusPage', component: BaselineCensusPage},
  ];
  adminPages: PageInterface[] = [
    { title: 'Dashboard', name: 'AdminDashboardPage', component: SupervisorModePage},
    { title: 'Baseline Census', name: 'BaselineCensusPage', component: BaselineCensusPage},
    { title: 'Synchronization', name: 'SynchronizeDbPage', component: SynchronizeDbPage},
    { title: 'Data Entry Approval', name: 'ApproveEntriesPage', component: ApproveEntriesPage}

  ];

  rootPage: any;

  constructor( public events: Events,  public menu: MenuController,  public platform: Platform, public splashScreen: SplashScreen,
               public userData: UserProvider, public appCtrl: App) {

    if(this.userData.hasLoggedIn()){
      this.rootPage = BaselineCensusPage;
    } else {
      this.rootPage = LoginPage;
    }
    this.platformReady();
  }

  isActive(page){
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  openPage(page){
    this.appCtrl.getRootNav().push(page.component);
  }

  logoutUser() {
    this.appCtrl.getRootNav().setRoot(LoginPage).showBackButton(false);
    this.userData.setUserLogout();
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}
