import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonicPage, Events, NavController, NavParams, ViewController} from 'ionic-angular';
import {NetworkConfigProvider} from "../../providers/network-config/network-config";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemConfigProvider} from "../../providers/system-config/system-config";
import {UserProvider} from "../../providers/user-provider/user-provider";
import {Visit} from "../../interfaces/visit";
import {VisitsProvider} from "../../providers/visits/visits";
import {Fieldworker} from "../../interfaces/fieldworker";
import {Individual} from "../../interfaces/individual";
import {FieldworkerProvider} from "../../providers/fieldworker/fieldworker";

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
  visitForm: FormGroup;

  //Default for a new location being created. Values will be set if a location is being fixed (due to errors that may have occurred).
  visit: Visit = {
    uuid: null,
    extId: null,
    realVisit: null,
    roundNumber: null,
    visitDate: null,
    visitLocation: null,
    collectedBy: null
  };

  constructor(public ev: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public formBuilder: FormBuilder, public visitProvider: VisitsProvider, public netConfig: NetworkConfigProvider,
              public user: UserProvider, public fwProvider: FieldworkerProvider) {

    this.collectedBy = this.navParams.data["collectedBy"];
    this.visitLocation = this.navParams.data["visitLocation"];
    this.visitForm = formBuilder.group({
      extId:['', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9 ]*')])],
      visitDate:['', Validators.compose([Validators.required])],
      realVisit:['', Validators.compose([Validators.required, Validators.pattern('0|1+')])],
      roundNumber: ['', Validators.compose([Validators.required, Validators.min(0)])]
    });
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  //Dismiss the modal. Pass back the created or fixed location.
  async popView() {
    await this.visitProvider.saveDataLocally(this.visit);
    this.navCtrl.pop()
  }
}
