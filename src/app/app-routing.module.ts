import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LandingComponent } from './core/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { AdministrationComponent } from './administration/administration.component';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'administration', component: AdministrationComponent },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}
