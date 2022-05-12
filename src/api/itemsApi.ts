import axios, { AxiosInstance } from "axios";
import { createItem } from "../types/requests/item-request-dto";
import item from "../types/responses/item-dto";


export class itemsApi {
    private readonly baseUrl:string = "https://localhost:5001";
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({baseURL: this.baseUrl, headers: {"Content-Type": "application/json"}});
    }

    public async getitems(): Promise<item[]> {
        return new Promise((resolve,reject) => {
            this.axiosInstance.get('/items').then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    public async getItemByName(name: string): Promise<item> {
        return new Promise((resolve, reject) => {
            this.axiosInstance.get(`items/${name}`).then((response) => {
                resolve(response.data);
            }).catch((err) => reject(err));
        });
    }

    public async createItem(newItem: createItem): Promise<void> {
        return new Promise((resolve,reject) => {
            this.axiosInstance.post('/items', newItem).then((response) => {
                if (response.status === 201) {
                    resolve();
                }
            }).catch((err) => console.log(err));
        });
    }
}