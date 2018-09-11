import {Component} from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController} from 'ionic-angular';
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import {NgForm} from "@angular/forms";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {Visit} from "../../model/visit";
import {VisitsProvider} from "../../providers/visits/visits";
import {Fieldworker} from "../../model/fieldworker";
import {Location} from "../../model/locations";
import {VisitFormGroup} from "../../census-forms/visit-form";
import {LoginProvider} from "../../providers/login/login";

/**
 * Generated class for the CreateVisitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'create-visit',
  templateUrl: 'create-visit.html',
})
export class CreateVisitPage {

  collectedBy: Fieldworker;
  visitLocation: Location;
  visitForm: VisitFormGroup;
  formSubmitted: boolean = false;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  visit: Visit = new Visit();

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public visitProvider: VisitsProvider, public netConfig: NetworkConfigProvider,
              public loginProvider: LoginProvider) {

      //Set fields that are passed from parent, and aren't filled in by fieldworker.
      this.visit.visitLocation = this.navParams.data["visitLocation"].extId;
      this.visit.collectedBy =  this.loginProvider.getLoggedInUser();

      this.visitForm = new VisitFormGroup();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  async submitForm(form: NgForm){
    this.formSubmitted = true;
    if(form.valid){
      this.visitProvider.saveDataLocally(this.visit);
      form.reset();
      this.formSubmitted = false;

      //Dismiss if valid, one visit per household.
      this.dismissForm()
    }


  }

  dismissForm(){
    this.navCtrl.pop()
  }
}
