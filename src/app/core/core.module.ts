import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from '../auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from '../administration/administration.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent,
    LoginComponent,
    DashboardComponent,
    AdministrationComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent
  ],
})
export class CoreModule {}
