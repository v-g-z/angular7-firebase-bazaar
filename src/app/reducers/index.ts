import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromBazaar from '../core/dashboard/store/bazaar.reducer';

export interface AppState {
  auth: fromAuth.State;
  bazaar: fromBazaar.State;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  bazaar: fromBazaar.bazaarReducer
};

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
export const getUser = createSelector(getAuthState, fromAuth.getUser);

export const getBazaarState = createFeatureSelector<fromBazaar.State>('bazaar');
export const getSelectedBazaar = createSelector(getBazaarState, fromBazaar.getSelectedBazaar);
// export const getBazaars = createSelector(getBazaarState, fromBazaar.getBazaars);
