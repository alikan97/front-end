import axios, { AxiosInstance } from "axios";
import { Dispatch } from "react";
import { itemsApi } from "../../api/itemsApi";
import { FilterRequest } from "../../types/filters";
import { createItemState } from "../../types/requests/create-item-dto";
import { itemsDispatchTypes, ITEMS_CREATED, ITEMS_FAILED, ITEMS_LOADING, ITEMS_SUCESS } from "./action-types";

export const getAllItemsAction = (skip: number, take: number) => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    try {
        const ex: AxiosInstance = axios.create();
        const filtRe: FilterRequest = {
            Categories: ["sdc"],
            price: 32
        }
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.getitems(ex, skip, take, 'sdf',filtRe).then((response => {
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

export const createNewItem = (newItem: createItemState) => async (dispatch: Dispatch<itemsDispatchTypes>) => {
    try {
        const ex: AxiosInstance = axios.create();
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.createItem(ex, newItem).then((_ => {
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
        const ex: AxiosInstance = axios.create();
        dispatch({
            type: ITEMS_LOADING,
        });
        itemsApi.getItemById(ex, name).then((response => {
            dispatch({
                type: ITEMS_SUCESS,
                payload: {
                    itemCount: 1,
                    results: [response]
                }
            });
        }));
    } catch (error) {
        dispatch({
            type: ITEMS_FAILED
        })
    }
}
