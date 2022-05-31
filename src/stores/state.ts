import { PageableResults } from "../types/filters";
import item from "../types/responses/item-dto";

export interface IDefaultState {
    loading: boolean,
    items: PageableResults<item>
}

export const initialState: IDefaultState = {
    loading: false,
    items: {
        itemCount: 0,
        results: []
    }
};
