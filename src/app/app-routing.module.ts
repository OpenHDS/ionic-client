import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'supervisor-dash', loadChildren: './pages/supervisor-dash/supervisor-dash.module#SupervisorDashPageModule' },
  { path: 'fieldworker-dash', loadChildren: './pages/fieldworker-dash/fieldworker-dash.module#FieldworkerDashPageModule' },
  { path: 'database-sync', loadChildren: './pages/database-sync/database-sync.module#DatabaseSyncPageModule' },
  { path: 'system-config', loadChildren: './pages/system-config/system-config.module#SystemConfigPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
