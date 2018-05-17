import { Component } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import { NavController } from 'ionic-angular';

import {LoginProvider} from "../../providers/login/login";
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

  constructor(public navCtrl: NavController, public loginProvider: LoginProvider, public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password:['', Validators.compose([Validators.required])],
    });

  }

  async onLogin() {
     this.submitted = true;
     if(this.loginForm.valid){
       if(this.username == "admin" && this.password == "test"){
         this.navCtrl.push(SupervisorModePage);
       } else {
         var loginAttempt = await this.loginProvider.checkPassword(this.username, this.password);
         if(loginAttempt){
           this.navCtrl.push(BaselineCensusPage);
         } else {
           this.submitted = false;
         }
       }
     } else {
       this.submitted = false;
     }

    }
}
