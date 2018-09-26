import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AuthEffects } from './auth/store/auth.effects';
import { environment } from '../environments/environment';
import { BazaarEffects } from './core/dashboard/store/bazaar.effects';
import { SnackbarEffects } from './shared/snackbar/snackbar.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    EffectsModule.forRoot([
      AuthEffects, BazaarEffects, SnackbarEffects
    ]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
