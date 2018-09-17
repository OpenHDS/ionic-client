import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataError} from "../../../model/data-errors";
import {ErrorsProvider} from "../../../services/errors/errors";

/**
 * Generated class for the ErrorReportingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'error-reporting',
  templateUrl: 'error-reporting.html',
})
export class ErrorReportingPage {
  @Input() entityType: string;
  @Input() entityId: string;
  errorMessage: string;
  showErrorReporting: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public errProvider: ErrorsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorReportingPage');
  }

  toggleErrorReportingView(){
    if(this.showErrorReporting){
      this.showErrorReporting = false;
    } else {
      this.showErrorReporting = true;
    }
  }

  saveError(){
    let err = new DataError();
    err.entityType = this.entityType;
    err.errorMessage = this.errorMessage;
    err.entityExtId = this.entityId;

    this.errProvider.saveError(err);
  }
}
