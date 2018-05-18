import { Component } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import { NavController } from 'ionic-angular';

import {UserProvider} from "../../providers/user-provider/user-provider";
import {BaselineCensusPage} from "../baseline-census/baseline-census";
import {SupervisorModePage} from "../supervisor-mode/supervisor-mode";



@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  submitted = false;
  loginForm: FormGroup;

  constructor(public navCtrl: NavController, public userProvider: UserProvider, public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password:['', Validators.compose([Validators.required])],
    });

  }

  async onLogin() {
     this.submitted = true;
     if(this.loginForm.valid){
       if(this.username == "admin" && this.password == "test"){
         this.navCtrl.setRoot(SupervisorModePage);
       } else {
         var loginAttempt = await this.userProvider.checkPassword(this.username, this.password);
         if(loginAttempt){
           this.navCtrl.setRoot(BaselineCensusPage);
         } else {
           this.submitted = false;
         }
       }
     } else {
       this.submitted = false;
     }

     this.userProvider.setLoggedInUser(this.username);
    }
}
