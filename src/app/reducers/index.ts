import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;

}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer

};

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
export const getUser = createSelector(getAuthState, fromAuth.getUser);

