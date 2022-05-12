import axios, { AxiosInstance } from "axios";
import { createItem } from "../types/requests/item-request-dto";
import item from "../types/responses/item-dto";


export namespace itemsApi {
    const baseUrl:string = "https://localhost:5001";
    const axiosInstance: AxiosInstance = axios.create({baseURL: baseUrl, headers: {"Content-Type": "application/json"}});

    export async function getitems(): Promise<item[]> {
        return new Promise((resolve,reject) => {
            axiosInstance.get('/items').then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    export async function getItemByName(name: string): Promise<item> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`items/${name}`).then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    export async function createItem(newItem: createItem): Promise<void> {
        return new Promise((resolve,reject) => {
            axiosInstance.post('/items', newItem).then((response) => {
                if (response.status === 201) {
                    resolve();
                }
            }).catch((err) => console.log(err));
        });
    }
}