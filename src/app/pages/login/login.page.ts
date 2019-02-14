import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Events, MenuController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/AuthService/auth.service';
import {SynchonizationObservableService} from "../../services/SynchonizationObserverable/synchonization-observable.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  readonly PAGE_NAME = "Login";
  submitted = false;
  loginForm: FormGroup;
  loginAsSuper = true;
  showLoginError = false;

  constructor(public router: Router, public ev: Events, public menu: MenuController, public syncObserver: SynchonizationObservableService,
              public navController: NavController, public translate: TranslateService,
              public authProvider: AuthService, public formBuilder: FormBuilder) {


    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // the root left menu should be disabled on this page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }

  get formControls(){
    return this.loginForm.controls;
  }

  async onLogin(value) {
    this.submitted = true;
    if (this.loginForm.valid) {

      if (this.loginAsSuper) {
        if (await this.authProvider.login(value.username, value.password, this.loginAsSuper)) {
          this.router.navigate(['/supervisor-dash']).then(() => {
            console.log("Logging in...");
            this.syncObserver.publishChange('Login:Admin:Success', true);
          });

          this.authProvider.setMenu();


        }

      } else {
        if (await this.authProvider.login(value.username, value.password)) {
          await this.router.navigate(['/fieldworker-dash']);
          this.authProvider.setMenu();
          this.ev.publish("Login:Fieldworker:Success");
        }
      }
    } else {
      this.showLoginError = true;
    }
  }
}
