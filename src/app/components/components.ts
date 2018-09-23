import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {OpenhdsTitleHeaderComponent} from "./openhds-title-header/openhds-title-header.component";
import {HierarchyListComponent} from "./hierarchy-list/hierarchy-list.component";
import {SocialGroupListComponent} from "./social-group-list/social-group-list.component";
import {IndividualListComponent} from "./individual-list/individual-list.component";

import {HelpPopoverComponent} from "./help-popover/help-popover.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [
    OpenhdsTitleHeaderComponent,
    HierarchyListComponent,
    SocialGroupListComponent,
    IndividualListComponent,
    HelpPopoverComponent
  ],
  exports: [
    OpenhdsTitleHeaderComponent,
    HierarchyListComponent,
    SocialGroupListComponent,
    IndividualListComponent,
    HelpPopoverComponent
  ],
  providers: [

  ],
  entryComponents: [],
})
export class ComponentsModule {}
