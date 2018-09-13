import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuController, NavController} from 'ionic-angular';
import {SupervisorModePage} from "../supervisor-mode/supervisor-mode";
import {FieldworkerModePage} from "../fieldworker-mode/fieldworker-mode";
import {AuthProvider} from "../../providers/authentication/authentication";



@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  submitted = false;
  loginForm: FormGroup;
  loginAsSuper: boolean = true;
  showLoginError = false;

  constructor(public navCtrl: NavController, public menu: MenuController,
              public authProvider: AuthProvider, public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password:['', Validators.compose([Validators.required])],
    });

  }

  ionViewWillEnter() {
    // the root left menu should be disabled on this page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }

  async onLogin() {
     this.submitted = true;
     if(this.loginForm.valid){

       if(this.loginAsSuper){
         if(await this.authProvider.login(this.username, this.password, this.loginAsSuper)){
           this.navCtrl.setRoot(SupervisorModePage);
           this.authProvider.setMenu();
         } else {
           this.submitted = false;
         }
       } else {
         if(await this.authProvider.login(this.username, this.password)){
           this.navCtrl.setRoot(FieldworkerModePage);
           this.authProvider.setMenu();
         } else {
           this.submitted = false;
         }
       }
     } else {
       this.submitted = false;
     }

     if(this.submitted) {
       this.showLoginError = false;
     } else {
       this.showLoginError = true
     }
    }
}
