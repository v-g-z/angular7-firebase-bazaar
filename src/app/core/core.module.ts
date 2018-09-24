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
import { CartComponent } from './dashboard/cart/cart.component';
import { ProtocolComponent } from './dashboard/protocol/protocol.component';
import { ReportComponent } from './dashboard/report/report.component';
import { SummaryComponent } from './dashboard/summary/summary.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent,
    LoginComponent,
    DashboardComponent,
    AdministrationComponent,
    CartComponent,
    ProtocolComponent,
    ReportComponent,
    SummaryComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent
  ]
})
export class CoreModule {}
