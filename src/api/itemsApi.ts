import { AxiosInstance } from "axios";
import QueryString from "qs";
import { FilterRequest } from "../types/filters";
import { createItem } from "../types/requests/item-request-dto";
import item, { itemsResponse } from "../types/responses/item-dto";


export namespace itemsApi {
    const itemsBaseUrl: string = "https://localhost:5001";

    export async function getitems(privateAxiosInstance: AxiosInstance, skip: number, take: number, text: string, filter: FilterRequest): Promise<itemsResponse> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.get(`${itemsBaseUrl}/items`, {
                params: {
                    skip: skip,
                    take: take,
                    keyword: text,
                    price: filter.price,
                    categories: filter.Categories
                },
                paramsSerializer: params => {
                    return QueryString.stringify(params, { arrayFormat: 'comma', encode: false });
                }
            }).then((response) => {
                resolve(response.data);
            }).catch((err) => console.log(err));
        });
    }

    export async function getItemByName(privateAxiosInstance: AxiosInstance, name: string): Promise<item[]> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.get(`${itemsBaseUrl}/items/${name}`).then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    export async function createItem(privateAxiosInstance: AxiosInstance, newItem: createItem): Promise<void> {
        return new Promise((resolve, reject) => {
            privateAxiosInstance.post(`${itemsBaseUrl}/items`, newItem).then((response) => {
                if (response.status === 201) {
                    resolve();
                }
            }).catch((err) => reject(err));
        });
    }
}