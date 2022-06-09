import { ReactNode } from "react"
import { Currency } from "../constants/enums";
export interface pagination {
    limit: number,
    skip: number,
}
export interface SearchSettings {
    itemsPerPage: number
}
export interface PageableResults<T> {
    itemCount: number;      // all items
    results: T[];
}
export interface SearchOptionsDefined {
    minCharactersToSearch: number;
    debounceWaitMilliSecs?: number;
    cacheTtlMins: number;
    savedFilterStorageKey?: string;
}
export interface SearchProviderProps<T> {
    children: ReactNode,
    entityName: string,
    itemsPerPage: number,
    findItems: (text: string, filters: FilterRequest, pagination: pagination) => Promise<PageableResults<T>>,
    searchOptions?: SearchOptionsDefined
}
export interface SearchCacheItem<T> {
    data: T;
    expiry: Date;
}
interface currencyType {
    currency: Currency
}
export interface genericFilter<T> {
    value: T,
// [key: string]: any,
    optionalParams?: currencyType,
}

export type SearchCache<T> = Record<string, Record<string, SearchCacheItem<T>>>;

export type AppliedFilterType = genericFilter<string | number | string[]>;

export interface AppliedFilter<T extends AppliedFilterType> {
    name: string,
    filter: T
}

export interface FilterRequest {
    Categories: Array<string | null>,
    price: number | null
}

export interface SearchContextProps<T> {
    searchText: AppliedFilter<AppliedFilterType>;
    setSearchText: (searchFilter: AppliedFilter<AppliedFilterType>) => void,
    Categories: AppliedFilter<AppliedFilterType>,
    setCategories: (category: AppliedFilter<AppliedFilterType>) => void,
    price: AppliedFilter<AppliedFilterType>,
    setPrice: (newPrice: AppliedFilter<AppliedFilterType>) => void,
    searchResults: PageableResults<T> | undefined,
    currentPage: number,
    setCurrentPage: (page: number) => void,
    clear: () => void,
    isLoading: boolean,
    error: Error | undefined;
}