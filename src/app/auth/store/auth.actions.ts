import { Action } from '@ngrx/store';


export enum AuthActionTypes {
    GET_USER = '[Auth] Get user',
    AUTHENTICATED = '[Auth] Authenticated',
    NOT_AUTHENTICATED = '[Auth] Not Authenticated',
    GOOGLE_LOGIN = '[Auth] Google login attempt',
    REGISTER_EMAIL_PASSWORD = '[Auth] Register with Email and Password',
    LOGOUT = '[Auth] Logout',
    AUTH_ERROR = '[Auth] Error'
}

export class GetUser implements Action {
    readonly type = AuthActionTypes.GET_USER;
    constructor(public payload?: any) { }
}

export class Authenticated implements Action {
    readonly type = AuthActionTypes.AUTHENTICATED;
    constructor(public payload: any) { }
}

export class NotAuthenticated implements Action {
    readonly type = AuthActionTypes.NOT_AUTHENTICATED;
    constructor(public payload?: any) { }
}

export class AuthError implements Action {
    readonly type = AuthActionTypes.AUTH_ERROR;
    constructor(public payload?: any) { }
}

/// Google Login Actions

export class GoogleLogin implements Action {
    readonly type = AuthActionTypes.GOOGLE_LOGIN;
    constructor(public payload?: any) { }
}

export class RegisterEmailPassword implements Action {
    readonly type = AuthActionTypes.REGISTER_EMAIL_PASSWORD;
    constructor(public payload: any) { }
}



/// Logout Actions

export class Logout implements Action {
    readonly type = AuthActionTypes.LOGOUT;
    constructor(public payload?: any) { }
}

export type AuthActions
    = GetUser
    | Authenticated
    | NotAuthenticated
    | GoogleLogin
    | RegisterEmailPassword
    | AuthError
    | Logout;
