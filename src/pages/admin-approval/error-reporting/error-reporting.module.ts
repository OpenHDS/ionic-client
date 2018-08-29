import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorReportingPage } from './error-reporting';

@NgModule({
  declarations: [
    ErrorReportingPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorReportingPage),
  ],
})
export class ErrorReportingPageModule {}
