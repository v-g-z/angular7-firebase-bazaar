import { Action } from '@ngrx/store';
import { IBazaarId } from '../../models/bazaar.model';

export enum BazaarActionTypes {
    // SET_BAZAARS = '[Bazaar] Set Bazaars',
    SET_SELECTED_BAZAAR = '[Bazaar] Set selected Bazaar'
}

// export class SetBazaars implements Action {
//     readonly type = BazaarActionTypes.SET_BAZAARS;
//     constructor(public payload: IBazaarId[]) { console.log('in fetch bazaar', payload)}
// }

export class SetSelectedBazaar implements Action {
    readonly type = BazaarActionTypes.SET_SELECTED_BAZAAR;
    constructor(public payload: IBazaarId) { }
}


export type BazaarActions = SetSelectedBazaar; // | SetBazaars;

