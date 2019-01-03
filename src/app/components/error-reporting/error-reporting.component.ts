import {Component, Input, OnInit} from '@angular/core';
import {DataError} from "../../models/data-error";
import {ErrorService} from "../../services/ErrorService/error-service";
import {NavigationService} from "../../services/NavigationService/navigation.service";

@Component({
  selector: 'error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportingComponent implements OnInit {

  entityType: string;
  entityId: string;
  errorMessage: string;
  constructor(public errProvider: ErrorService, public navParams: NavigationService) {
    this.entityId = this.navParams.data.entityId;
    this.entityType = this.navParams.data.entityType;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorReportingPage');
  }


  saveError(){
    let err = new DataError();
    err.entityType = this.entityType;
    err.errorMessage = this.errorMessage;
    err.entityId = this.entityId;
    err.resolved = false;

    console.log(err);
    this.errProvider.saveError(err);
  }

  ngOnInit() {
  }

}
