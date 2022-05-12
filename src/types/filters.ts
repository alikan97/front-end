export interface filters {
    keyword: string,
    price: number,
    category: string
}

export interface pagination {
    limit: number,
    skip: number,
    itemsPerPage: number
}