import { AxiosInstance } from "axios";
import { createItem } from "../types/requests/item-request-dto";
import item, {itemsResponse} from "../types/responses/item-dto";


export namespace itemsApi {
    const itemsBaseUrl:string = "https://localhost:5001";

    export async function getitems(privateAxiosInstance: AxiosInstance, skip: number, take: number): Promise<itemsResponse> {
        console.log(privateAxiosInstance.head);
        return new Promise((resolve,reject) => {
            privateAxiosInstance.get(`${itemsBaseUrl}/items`,{ params: { skip: skip, take: take} }).then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
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
        return new Promise((resolve,reject) => {
            privateAxiosInstance.post(`${itemsBaseUrl}/items`, newItem).then((response) => {
                if (response.status === 201) {
                    resolve();
                }
            }).catch((err) => reject(err));
        });
    }
}