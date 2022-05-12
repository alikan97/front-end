import item from "../types/responses/item-dto";

export interface IDefaultState {
    loading: boolean,
    items?: item[]
}

export const initialState: IDefaultState = {
    loading: false,
};
