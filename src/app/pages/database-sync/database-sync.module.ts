import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DatabaseSyncPage } from './database-sync.page';
import {FieldworkerService} from "../../services/FieldworkerService/fieldworker.service";
import {IndividualService} from "../../services/IndividualService/individual.service";
import {LocationService} from "../../services/LocationService/location.service";
import {LocationHierarchyService} from "../../services/LocationHierarchyService/location-hierarchy.service";
import {SocialGroupService} from "../../services/SocialGroupService/social-group.service";
import {CensusSubmissionService} from "../../services/CensusSubmissionService/census-submission.service";
import {ComponentsModule} from "../../components/components";

const routes: Routes = [
  {
    path: '',
    component: DatabaseSyncPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DatabaseSyncPage],
  providers: [CensusSubmissionService, FieldworkerService, IndividualService,
    LocationService, LocationHierarchyService, IndividualService, SocialGroupService]
})
export class DatabaseSyncPageModule {}
