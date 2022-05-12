import { Dispatch } from "react";
import { itemsApi } from "../../api/itemsApi";
import { createItem } from "../../types/requests/item-request-dto";
import { itemsDispatchTypes, ITEMS_CREATED, ITEMS_FAILED, ITEMS_LOADING, ITEMS_SUCESS } from "./action-types";

export const getAllItemsAction = () => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.getitems().then((response => {
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
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.createItem(newItem).then((_ => {
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
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.getItemByName(name).then((response => {
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
