import * as AuthActions from './auth.actions';
import { User } from '../models/user.model';

export interface State {
    user: User;
    authenticated: boolean;
}

const initiaState: State = {
    user: null,
    authenticated: false
};

export function authReducer(state = initiaState, action: AuthActions.AuthActions) {
    switch (action.type) {

        case AuthActions.AuthActionTypes.GET_USER:
            return { ...state };

        case AuthActions.AuthActionTypes.AUTHENTICATED:
            return {
                ...state,
                user: action.payload,
                authenticated: true
            };

        case AuthActions.AuthActionTypes.NOT_AUTHENTICATED:
            return { ...state, ...initiaState };

        case AuthActions.AuthActionTypes.GOOGLE_LOGIN:
            return { ...state };

        case AuthActions.AuthActionTypes.REGISTER_EMAIL_PASSWORD:
            return { ...state };

        case AuthActions.AuthActionTypes.AUTH_ERROR:
            return {
                ...state,
                authenticated: false,
                user: null
            };

        case AuthActions.AuthActionTypes.LOGOUT:
            return {
                ...state,
                authenticated: false,
                user: null
            };
        default:
            return state;
    }
}

export const getIsAuthenticated = (state: State) => state.authenticated;
export const getUser = (state: State) => state.user;
