import {Component, Input, OnInit} from '@angular/core';
import {DataError} from "../../models/data-error";
import {ErrorService} from "../../services/ErrorService/error-service";

@Component({
  selector: 'error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportingComponent implements OnInit {

  @Input() entityType: string;
  @Input() entityId: string;
  errorMessage: string;
  showErrorReporting: boolean = false;
  constructor(public errProvider: ErrorService) {
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

  ngOnInit() {
  }

}
