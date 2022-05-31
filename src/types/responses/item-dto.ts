export default interface item {
    id: string,
    name: string,
    price: number,
    createdDate: string
}

export interface itemsResponse {
    itemsCount: number,
    data: item[]
}