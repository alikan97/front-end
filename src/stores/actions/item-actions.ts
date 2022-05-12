import { Dispatch } from "react";
import { itemsApi } from "../../api/itemsApi";
import { createItem } from "../../types/requests/item-request-dto";
import item from "../../types/responses/item-dto";

export const ITEMS_SUCESS = "ITEMS_SUCCESS";
export const ITEMS_LOADING = "ITEMS_LOADING";
export const ITEMS_FAILED = "ITEMS_FAILED";
export const ITEMS_CREATED = "ITEMS_CREATED";

export interface itemsSuccess {
    type: typeof ITEMS_SUCESS
    payload: item[]
}
export interface itemsLoading {
    type: typeof ITEMS_LOADING
}
export interface itemsFailed {
    type: typeof ITEMS_FAILED
}
export interface itemsCreated{
    type: typeof ITEMS_CREATED
}

export type itemsDispatchTypes = itemsSuccess | itemsLoading | itemsFailed | itemsCreated;

export const getAllItemsAction = () => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    const items = new itemsApi();
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        items.getitems().then((response => {
            dispatch({
                type: ITEMS_SUCESS,
                payload: response
            })
        }));
    } catch (error) {
        dispatch({
            type: ITEMS_FAILED
        })
    }
}

export const createNewItem = (newItem: createItem) => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    const items = new itemsApi();
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        items.createItem(newItem).then((_ => {
            dispatch({
                type: ITEMS_CREATED,
            });
        }));
    } catch (error) {
        dispatch({
            type: ITEMS_FAILED
        })
    }
}

export const getItemByName = (name:string) => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    const items = new itemsApi();
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        items.getItemByName(name).then((response => {
            dispatch({
                type: ITEMS_SUCESS,
                payload: [response]
            });
        }));
    } catch (error) {
        dispatch({
            type: ITEMS_FAILED
        })
    }
}
