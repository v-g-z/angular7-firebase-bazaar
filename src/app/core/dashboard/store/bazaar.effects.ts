import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

// import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

// import * as firebase from 'firebase';

import { Observable, of, from, observable } from 'rxjs';

import { Router } from '@angular/router';
import { map, switchMap, delay } from 'rxjs/operators';

import * as BazaarActions from './bazaar.actions';
import * as UIActions from '../../../shared/ui.actions';
import { Action, Store } from '@ngrx/store';
import { IBazaarId } from '../../models/bazaar.model';
import * as SnackbarActions from '../../../shared/snackbar/snackbar.actions';
import * as fromApp from '../../../reducers/index';

@Injectable()
export class BazaarEffects {

    @Effect() query$: Observable<Action> = this.actions$.ofType(BazaarActions.BazaarActionTypes.QUERY).pipe(
        switchMap((action: BazaarActions.Query) => {
            // , ref => ref.where('players.name', 'array-contains', _name)
            // , ref => ref.where('margin', '==', 20)
            const col = this.afs.collection<IBazaarId>('bazaars', ref => ref.where('access', 'array-contains', action.payload));
            return col.snapshotChanges().pipe(
                map(arr => {
                    return arr.map(doc => {
                        const data = doc.payload.doc.data();
                        return { id: doc.payload.doc.id, ...data } as IBazaarId;
                    });
                }));
        }),
        map(arr => {
            // console.log(arr);
            return new BazaarActions.AddAll(arr);
        }));


    @Effect() create$ = this.actions$.ofType(BazaarActions.BazaarActionTypes.CREATE_BAZAAR).pipe(
        // map((action) => action.type ), 
        switchMap((action: BazaarActions.CreateBazaar) => {
            this.store.dispatch(new UIActions.StartLoading());
            // console.log('in create effect', action.payload);
            // const ref = this.afs.doc<IBazaarId>(`bazaars/${pizza.id}`)
            const ref = this.afs.collection<IBazaarId>('bazaars');
            return ref.add(action.payload);
        }),
        delay(2000),
        map((reference) => {
            // console.log('reference craete', reference.id); // documentID
            this.store.dispatch(new SnackbarActions.SnackbarOpen({
                message: 'Sehr gut! Du hast deinen Bazaar erfolgreich angelegt!!'
            }));
            // this.router.navigateByUrl(`/dashboard`);
            this.store.dispatch(new UIActions.StopLoading());

            return new BazaarActions.FindAndSelectBazaar(reference.id);
        }),
    );

    // Listen for the 'UPDATE' action

    @Effect() update$: Observable<Action> = this.actions$.ofType(BazaarActions.BazaarActionTypes.UPDATE_BAZAAR).pipe(
        // map((action: actions.Update) => action),
        switchMap((action: BazaarActions.UpdateBazaar) => {
            this.store.dispatch(new UIActions.StartLoading());
            
            const ref = this.afs.doc<IBazaarId>(`bazaars/${action.payload.id}`);
            // console.log('action.payload.id', action.payload.id);
            ref.update(action.payload.data);
            return [action.payload.id];
        }),
        delay(2000),
        map((reference) => {
            // console.log('reference', reference);
            this.store.dispatch(new SnackbarActions.SnackbarOpen({
                message: 'Aktualisierung erfolgreich'
            }));
            this.store.dispatch(new UIActions.StopLoading());
            
            return new BazaarActions.FindAndSelectBazaar(reference);
            // return new BazaarActions.Success();
        }));




    constructor(
        private actions$: Actions,
        private afs: AngularFirestore,
        private store: Store<fromApp.AppState>,
        private router: Router
    ) { }

}

