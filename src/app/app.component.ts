import {Component, Input, ViewChild} from '@angular/core';

import {Nav, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {User} from "./models/user";
import {AuthService} from "./services/AuthService/auth.service";
import {Router} from "@angular/router";

export interface PageInterface {
  title: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  user: User;

  fieldworkerPages: PageInterface[] = [
    { title: 'Dashboard', url: "/fieldworker-dash" },
    { title: 'Baseline Census', url: "/baseline"},
    { title: 'Search For a Record', url: "/search"},
    { title: 'Data Entry Correction', url: '/correction-routine'}
  ];
  adminPages: PageInterface[] = [
    { title: 'Dashboard', url: "/supervisor-dash" },
    { title: 'Baseline Census', url: '/baseline'},
    { title: 'Search For a Record', url: '/search'},
    { title: 'Synchronization', url: "/database-sync"},
    { title: 'Data Entry Approval', url: '/approval'},
    { title: 'System Configurations', url: '/system-config'},
    { title: 'Data Entry Correction', url: '/correction-routine'}

  ];

  rootPage: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService
  ) {

    if(this.authService.getLoggedIn() === false){
      this.router.navigate(['/login']);
    }

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page){
    this.router.navigate([page])
  }

  logoutUser() {
    this.router.navigate(["/login"]).then(() => this.authService.logout());
  }
}


