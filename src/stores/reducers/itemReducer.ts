import { itemsDispatchTypes, ITEMS_FAILED, ITEMS_LOADING, ITEMS_SUCESS } from "../actions/action-types";
import { initialState } from "../state";
import { IDefaultState } from "../state";

export const itemReducer = (state: IDefaultState = initialState, action: itemsDispatchTypes): IDefaultState => {
    switch (action.type) {
        case ITEMS_SUCESS: 
            return {
                loading: false,
                items: action.payload
            }
        case ITEMS_FAILED:
            return {
                items: [...state.items],
                loading: false,
            }
        case ITEMS_LOADING:
            return {
                items: [...state.items],
                loading: true,
            }
        default:
            return {
                items: [...state.items],
                loading: true
            }
    }
}

export default itemReducer;