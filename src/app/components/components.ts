import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {OpenhdsTitleHeaderComponent} from "./openhds-title-header/openhds-title-header.component";
import {HierarchyListComponent} from "./hierarchy-list/hierarchy-list.component";
import {LocationListComponent} from "./location-list/location-list.component";
import {SocialGroupListComponent} from "./social-group-list/social-group-list.component";
import {IndividualListComponent} from "./individual-list/individual-list.component";
import {LocationHierarchyService} from "../services/LocationHierarchyService/location-hierarchy.service";
import {LocationService} from "../services/LocationService/location.service";
import {SocialGroupService} from "../services/SocialGroupService/social-group.service";
import {IndividualService} from "../services/IndividualService/individual.service";

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
    LocationListComponent,
    SocialGroupListComponent,
    IndividualListComponent
  ],
  exports: [
    OpenhdsTitleHeaderComponent,
    HierarchyListComponent,
    LocationListComponent,
    SocialGroupListComponent,
    IndividualListComponent
  ],
  providers: [
    LocationHierarchyService,
    LocationService,
    SocialGroupService,
    IndividualService
  ],
  entryComponents: [],
})
export class ComponentsModule {}
