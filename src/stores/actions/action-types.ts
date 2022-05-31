import { PageableResults } from "../../types/filters";
import item from "../../types/responses/item-dto";

export const ITEMS_SUCESS = "ITEMS_SUCCESS";
export const ITEMS_LOADING = "ITEMS_LOADING";
export const ITEMS_FAILED = "ITEMS_FAILED";
export const ITEMS_CREATED = "ITEMS_CREATED";

export interface itemsSuccess {
    type: typeof ITEMS_SUCESS
    payload: PageableResults<item>
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