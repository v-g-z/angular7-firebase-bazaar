import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// firebase
// https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { MaterialModule } from '../material.module';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    // AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features,
  ],
  exports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
  ]
})
export class SharedModule { }
