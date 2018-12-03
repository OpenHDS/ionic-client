import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  { path: 'supervisor-dash',  loadChildren: './pages/supervisor-dash/supervisor-dash.module#SupervisorDashPageModule'},
  { path: 'fieldworker-dash',  loadChildren: './pages/fieldworker-dash/fieldworker-dash.module#FieldworkerDashPageModule' },
  { path: 'database-sync',  loadChildren: './pages/database-sync/database-sync.module#DatabaseSyncPageModule' },
  { path: 'system-config', loadChildren: './pages/system-config/system-config.module#SystemConfigPageModule' },
  { path: 'baseline',  loadChildren: './pages/baseline-census/baseline-census.module#BaselineCensusPageModule'},
  { path: 'create-location', loadChildren: './pages/create-entity/create-location/create-location.module#CreateLocationPageModule' },
  { path: 'create-social-group',  loadChildren: './pages/create-entity/create-social-group/create-social-group.module#CreateSocialGroupPageModule' },
  { path: 'create-individual', loadChildren: './pages/create-entity/create-individual/create-individual.module#CreateIndividualPageModule' },
  { path: 'create-visit', loadChildren: './pages/create-entity/create-visit/create-visit.module#CreateVisitPageModule' },
  { path: 'search',  loadChildren: './pages/search/search.module#SearchPageModule' },
  { path: 'approval', loadChildren: './pages/data-entry-approval/data-entry-approval.module#DataEntryApprovalPageModule' },
  { path: 'correction-routine',  loadChildren: './pages/entity-correction/entity-correction.module#EntityCorrectionPageModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
