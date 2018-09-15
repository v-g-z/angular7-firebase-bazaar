import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import * as firebase from 'firebase';

import { Observable, of, from, observable } from 'rxjs';

import { catchError, map, mapTo, switchMap, mergeMap } from 'rxjs/operators';

import * as BazaarActions from './bazaar.actions';

@Injectable()
export class BazaarEffects {

    // @Effect()
    // fetchBazaar: Observable<BazaarActions.BazaarActions> = this.actions$.ofType(BazaarActions.BazaarActionTypes.FETCH_BAZAAR)
    //     .pipe(
    //         map((action: BazaarActions.FetchBazaar) => action.payload)
    //         , switchMap(payload => {
    //             console.log('in effect fetch bazaar', payload);
    //             let itemDoc: AngularFirestoreDocument<any>;
    //             itemDoc = this.afs.doc<any>('bazaars/'+payload);
    //             itemDoc.valueChanges();
    //             console.log('valueChanges', itemDoc);
    //             const bazaarCollection = itemDoc.collection<any>('cartItems');
    //             return bazaarCollection.snapshotChanges().pipe(
    //               map(actions => actions.map(a => {
    //                 const data = a.payload.doc.data() ;
    //                 console.log('cartItems', data);
    //                 const id = a.payload.doc.id;
    //                 return { id, ...data };
    //               })))
    //         }),
    //         map(data => {
    //             return new BazaarActions.SetSelectedBazaar({ data: '1' });
    //         })
    //         , catchError(err => of(new BazaarActions.FetchBazaarError({ error: err.message })))

    //     );




    constructor(private actions$: Actions, private afs: AngularFirestore) { }

}

