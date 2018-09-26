import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromBazaar from '../core/dashboard/store/bazaar.reducer';
import * as fromUi from '../shared/ui.reducer';

export interface AppState {
  ui: fromUi.State;
  auth: fromAuth.State;
  bazaar: fromBazaar.State;
}

export const reducers: ActionReducerMap<AppState> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  bazaar: fromBazaar.bazaarReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
export const getUser = createSelector(getAuthState, fromAuth.getUser);

export const getBazaarState = createFeatureSelector<fromBazaar.State>('bazaar');
export const getSelectedBazaar = createSelector(getBazaarState, fromBazaar.getSelectedBazaar);
export const getBazaars = createSelector(getBazaarState, fromBazaar.getBazaars);
