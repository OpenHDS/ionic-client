import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuController, NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user-provider/user-provider";
import {SupervisorModePage} from "../supervisor-mode/supervisor-mode";
import {FieldworkerModePage} from "../fieldworker-mode/fieldworker-mode";



@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  submitted = false;
  loginForm: FormGroup;
  showLoginError = false;

  constructor(public navCtrl: NavController, public menu: MenuController, public userProvider: UserProvider,
              public formBuilder: FormBuilder) {

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
       if(this.username == "admin" && this.password == "test"){
         this.navCtrl.setRoot(SupervisorModePage);
       } else {
         var loginAttempt = await this.userProvider.checkPassword(this.username, this.password);
         if(loginAttempt){
           this.navCtrl.setRoot(FieldworkerModePage);
         } else {
           this.submitted = false;
         }
       }
     } else {
       this.submitted = false;
     }

     if(this.submitted) {
       this.userProvider.setLoggedInUser(this.username);
       this.showLoginError = false;
     } else {
       this.showLoginError = true
     }

    }
}
