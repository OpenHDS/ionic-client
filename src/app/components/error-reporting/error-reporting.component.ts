import {Component, Input, OnInit} from '@angular/core';
import {DataError} from "../../models/data-error";
import {ErrorService} from "../../services/ErrorService/error-service";
import {NavigationService} from "../../services/NavigationService/navigation.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportingComponent implements OnInit {
  validationErrors = false;
  entityType: string;
  entityId: string;
  errorMessage: string;
  constructor(public errProvider: ErrorService, public navParams: NavigationService, public modalCntrl: ModalController) {
    this.entityId = this.navParams.data.entityId;
    this.entityType = this.navParams.data.entityType;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorReportingPage');
  }


  saveError(){
    if(this.errorMessage == undefined || this.errorMessage.trimLeft().length === 0){
      this.validationErrors = true;
    } else {
      let err = new DataError();
      err.entityType = this.entityType;
      err.errorMessage = this.errorMessage;
      err.entityId = this.entityId;
      err.resolved = false;

      this.errProvider.saveError(err);
      this.validationErrors = false;
    }
  }

  ngOnInit() {
  }

  closeModal(){
    this.modalCntrl.dismiss();
  }
}
