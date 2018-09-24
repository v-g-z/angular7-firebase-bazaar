import * as BazaarActions from './bazaar.actions';
import { IBazaarId } from '../../models/bazaar.model';

export interface State {
    bazaars: IBazaarId[];
    selectedBazaar: IBazaarId;
}

const initiaState: State = {
    bazaars: null,
    selectedBazaar: null
};

export function bazaarReducer(state = initiaState, action: BazaarActions.BazaarActions) {
    switch (action.type) {

        // case BazaarActions.BazaarActionTypes.SET_BAZAARS:
        //     return {
        //          ...state,
        //          bazaars: action.payload 
        //         };
        case BazaarActions.BazaarActionTypes.ADD_ALL:
            // return pizzaAdapter.addAll(action.pizzas, state);
            return {
                ...state,
                bazaars: action.payload
            };
            case BazaarActions.BazaarActionTypes.SET_SELECTED_BAZAAR:
            console.log('in bazaarReducer SET_SELECTED_BAZAAR - payload', action.payload);
            return {
                ...state,
                selectedBazaar: action.payload
            };
            case BazaarActions.BazaarActionTypes.RESET_SELECTED_BAZAAR:
            return {
                ...state,
                selectedBazaar: null
            };
        default:
            return state;
    }
}

export const getSelectedBazaar = (state: State) => state.selectedBazaar;
export const getBazaars = (state: State) => state.bazaars;



