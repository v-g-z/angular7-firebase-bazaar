import { Action } from '@ngrx/store';
import { IBazaarId } from '../../models/bazaar.model';

export enum BazaarActionTypes {
    // SET_BAZAARS = '[Bazaar] Set Bazaars',
    SET_SELECTED_BAZAAR = '[Bazaar] Set selected Bazaar',
    RESET_SELECTED_BAZAAR = '[Bazaar] Reset selected Bazaar',
    QUERY = '[Bazaar] Query',
    ADD_ALL = '[Bazaar] Add all'
}
export class Query implements Action {
    readonly type = BazaarActionTypes.QUERY;
    constructor() {
        console.log('in bazaar actions QUERY');
    }
}

export class AddAll implements Action {
    readonly type = BazaarActionTypes.ADD_ALL;
    constructor(public payload: IBazaarId[]) { }
}
// export class SetBazaars implements Action {
//     readonly type = BazaarActionTypes.SET_BAZAARS;
//     constructor(public payload: IBazaarId[]) { console.log('in fetch bazaar', payload)}
// }

export class SetSelectedBazaar implements Action {
    readonly type = BazaarActionTypes.SET_SELECTED_BAZAAR;
    constructor(public payload: IBazaarId) { }
}

export class ResetSelectedBazaar implements Action {
    readonly type = BazaarActionTypes.RESET_SELECTED_BAZAAR;
}


export type BazaarActions
    = SetSelectedBazaar
    | ResetSelectedBazaar
    | Query
    | AddAll; // | SetBazaars;

