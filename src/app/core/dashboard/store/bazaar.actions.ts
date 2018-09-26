import { Action } from '@ngrx/store';
import { IBazaarId } from '../../models/bazaar.model';

export enum BazaarActionTypes {
    // SET_BAZAARS = '[Bazaar] Set Bazaars',
    SET_SELECTED_BAZAAR = '[Bazaar] Set selected Bazaar',
    FIND_AND_SELECT_BAZAAR = '[Bazaar] Find and Set Bazaar as selected',
    RESET_SELECTED_BAZAAR = '[Bazaar] Reset selected Bazaar',
    QUERY = '[Bazaar] Query',
    SUCCESS = '[Bazaar] Successfully created or updated',
    ADD_ALL = '[Bazaar] Add all',
    CREATE_BAZAAR = '[Bazaar] Create new Bazaar',
    UPDATE_BAZAAR = '[Bazaar] Update Bazaar'
}
export class Query implements Action {
    readonly type = BazaarActionTypes.QUERY;
    constructor(public payload: string) { }
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

export class FindAndSelectBazaar implements Action {
    readonly type = BazaarActionTypes.FIND_AND_SELECT_BAZAAR;
    constructor(public payload: string) { }
}

export class ResetSelectedBazaar implements Action {
    readonly type = BazaarActionTypes.RESET_SELECTED_BAZAAR;
}

export class CreateBazaar implements Action {
    readonly type = BazaarActionTypes.CREATE_BAZAAR;
    constructor(public payload: IBazaarId) { }

}

export class UpdateBazaar implements Action {
    readonly type = BazaarActionTypes.UPDATE_BAZAAR;
    constructor(public payload: any) { }

}


export class Success implements Action {
    readonly type = BazaarActionTypes.SUCCESS;
    constructor() { }
}

export type BazaarActions
    = SetSelectedBazaar
    | FindAndSelectBazaar
    | ResetSelectedBazaar
    | Query
    | Success
    | CreateBazaar
    | UpdateBazaar
    | AddAll; // | SetBazaars;

