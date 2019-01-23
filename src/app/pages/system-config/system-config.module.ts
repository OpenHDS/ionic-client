import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemConfigPage} from "./system-config.page";
import {ComponentsModule} from "../../components/components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: SystemConfigPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()

  ],

  declarations: [SystemConfigPage]
})
export class SystemConfigPageModule { }
