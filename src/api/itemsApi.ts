import { AxiosInstance, AxiosResponse } from "axios";
import QueryString from "qs";
import { FilterRequest } from "../types/filters";
import { createItemState } from "../types/requests/create-item-dto";
import { createItemResponse } from "../types/responses/create-item-response";
import item, { itemsResponse } from "../types/responses/item-dto";


export namespace itemsApi {
    const itemsBaseUrl: string = "https://localhost:5001";

    export async function getitems(privateAxiosInstance: AxiosInstance, skip: number, take: number, text: string, filter: FilterRequest): Promise<itemsResponse> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.get(`${itemsBaseUrl}/items`, {
                params: {
                    skip: skip,
                    take: take,
                    keyword: text ? text : undefined,
                    price: filter.price ? filter.price : undefined,
                    categories: filter.Categories.length ? filter.Categories : undefined
                },
                paramsSerializer: params => {
                    return QueryString.stringify(params, { arrayFormat: 'repeat', encode: false });
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((err) => console.log(err));
        });
    }

    export async function getItemById(privateAxiosInstance: AxiosInstance, id: string): Promise<item> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.get(`${itemsBaseUrl}/items/${id}`).then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    export async function createItem(privateAxiosInstance: AxiosInstance, newItem: createItemState): Promise<createItemResponse> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.post(`${itemsBaseUrl}/items`, newItem).then((response) => {
                if (response.status === 201) {
                    resolve(response.data);
                }
            }).catch((err) => reject(err));
        });
    }
}