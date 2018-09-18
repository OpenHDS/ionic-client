import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {OpenhdsTitleHeaderComponent} from "./openhds-title-header/openhds-title-header.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [OpenhdsTitleHeaderComponent],
  exports: [OpenhdsTitleHeaderComponent],
  entryComponents: [],
})
export class ComponentsModule {}
