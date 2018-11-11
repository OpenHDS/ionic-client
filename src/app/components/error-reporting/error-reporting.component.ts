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
  showErrorReporting: boolean = false;
  constructor(public errProvider: ErrorService, public navParams: NavigationService) {
    this.entityId = this.navParams.data.entityId;
    this.entityType = this.navParams.data.entityType;
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
    err.resolved = false;

    console.log(err);
    this.errProvider.saveError(err);
  }

  ngOnInit() {
  }

}
