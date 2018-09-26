import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { User } from '../models/user.model';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Observable, of, from } from 'rxjs';

import { catchError, map, mapTo, switchMap, mergeMap } from 'rxjs/operators';


import * as AuthActions from './auth.actions';


@Injectable()
export class AuthEffects {

    @Effect()
    getUser: Observable<AuthActions.AuthActions> = this.actions$.ofType(AuthActions.AuthActionTypes.GET_USER)
        .pipe(
            map((action: AuthActions.GetUser) => action.payload)
            , switchMap(payload => this.afAuth.authState)
            , map(authData => {
                if (authData) {
                    /// User logged in
                    const user = new User(authData.uid, authData.displayName, authData.email, authData.emailVerified, authData.photoURL);
                    return new AuthActions.Authenticated(user);
                } else {
                    /// User not logged in
                    return new AuthActions.NotAuthenticated();
                }

            })
            , catchError(err => of(new AuthActions.AuthError({ error: err.message })))
        );

    @Effect()
    login: Observable<AuthActions.AuthActions> = this.actions$.ofType(AuthActions.AuthActionTypes.GOOGLE_LOGIN)
        .pipe(
            map((action: AuthActions.GoogleLogin) => action.payload)
            , switchMap(payload => {
                return from(this.googleLogin());
            })
            , map(credential => {
                console.log('in auth effects.login - credential', credential);
                // successful login
                return new AuthActions.GetUser();
            })
            , catchError(err => of(new AuthActions.AuthError({ error: err.message })))
        );

    @Effect()
    register: Observable<AuthActions.AuthActions> = this.actions$.ofType(AuthActions.AuthActionTypes.REGISTER_EMAIL_PASSWORD)
        .pipe(
            map((action: AuthActions.RegisterEmailPassword) => action.payload)
            , switchMap(payload => {
                return from(this.registerEmailPassword(payload));
            })
            , map(credential => {
                console.log('in auth effects.login - credential', credential);
                // successful login
                return new AuthActions.GetUser();
            })
            , catchError(err => of(new AuthActions.AuthError({ error: err.message })))
        );

    @Effect()
    logout: Observable<AuthActions.AuthActions> = this.actions$.ofType(AuthActions.AuthActionTypes.LOGOUT)
        .pipe(
            map((action: AuthActions.Logout) => action.payload)
            , switchMap(payload => {
                return of(this.afAuth.auth.signOut());
            })
            , map(authData => {
                return new AuthActions.NotAuthenticated();
            })
            , catchError(err => of(new AuthActions.AuthError({ error: err.message })))

        );



    // private registerEmailPassword(): firebase.Promise<any> {
        private registerEmailPassword(payload) {
            return this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password)
        }
    
    // private googleLogin(): firebase.Promise<any> {
        private googleLogin() {
            const provider = new firebase.auth.GoogleAuthProvider();
            return this.afAuth.auth.signInWithPopup(provider);
        }
    
        
    constructor(private actions$: Actions, private afAuth: AngularFireAuth) { }

}
