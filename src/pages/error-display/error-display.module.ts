import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorDisplayPage } from './error-display';

@NgModule({
  declarations: [
    ErrorDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorDisplayPage),
  ],
})
export class ErrorDisplayPageModule {}
