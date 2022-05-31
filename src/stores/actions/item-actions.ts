import { Dispatch } from "react";
import { itemsApi } from "../../api/itemsApi";
import { createItem } from "../../types/requests/item-request-dto";
import { itemsDispatchTypes, ITEMS_CREATED, ITEMS_FAILED, ITEMS_LOADING, ITEMS_SUCESS } from "./action-types";

export const getAllItemsAction = (skip: number, take: number) => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    try {
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.getitems(skip, take).then((response => {
            dispatch({
                type: ITEMS_SUCESS,
                payload: {
                    itemCount: response.itemsCount,
                    results: response.data
                }
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
                payload: {
                    itemCount: response.length,
                    results: response
                }
            });
        }));
    } catch (error) {
        dispatch({
            type: ITEMS_FAILED
        })
    }
}
