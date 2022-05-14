import { ReactNode } from "react"
import { InputTypes, MultipleTypeDefinition, TypeDefinitionTypes } from "../constants/definitions";

export interface pagination {
    limit: number,
    skip: number,
}
export interface SearchSettings {
    itemsPerPage: number
}
export interface PageableResults<T> {
    itemCount: number;
    results: T[];
}

export interface searchOptions {
    cacheTtlMins?: number,
    debounceWaitMilliSecs?: number,
    minCharactersToSearch?: number,
}
export interface SearchOptionsDefined extends searchOptions {
    minCharactersToSearch: number;
    debounceWaitMilliSecs: number;
    cacheTtlMins: number;
    savedFilterStorageKey: string;
}
export interface SearchProviderProps<T> {
    children: ReactNode,
    entityName: string,
    findItems: (text: string, filters: Record<string, unknown>, pagination: pagination) => Promise<PageableResults<T>>,
    searchOptions?: searchOptions
}

export interface EntityField {
    display: string,
    id: string,
}
export interface SearchCacheItem<T> {
    data: T;
    expiry: Date;
}

export type SearchCache<T> = Record<string, Record<string, SearchCacheItem<T>>>;

export interface PropertyDefinition {
    label: string;
    description: string | null;
    type: TypeDefinitionTypes;
    input: InputTypes;
    format: string;
    multiple: MultipleTypeDefinition | null;
}

export type FilterFieldTypes = TypeDefinitionTypes | 'entity';

export interface FilterFieldPropertyDefintion extends Omit<PropertyDefinition, 'type'> {
    type: FilterFieldTypes
}

export type AppliedFilterType = string | number | EntityField;
export interface AppliedFilter<T extends AppliedFilterType> {
    id: string,
    definition: FilterFieldPropertyDefintion,
    propertyPath: string,
    ids?: string[],
    value: T
}

export interface SavedFilterItem {
    filters: AppliedFilter<AppliedFilterType>[];
    created: number;
}
export type SavedFilters = Record<string, SavedFilterItem>;

export interface SearchContextProps<T> {
    searchText: string;
    setSearchText: (text: string) => void,
    searchResults: PageableResults<T> | undefined,
    searchSettings: SearchSettings,
    setSearchSettings: (searchSettings: SearchSettings) => void,
    currentPage: number,
    setCurrentPage: (page: number) => void,
    clear: () => void,
    isLoading: boolean,
    filters: AppliedFilter<AppliedFilterType>[],
    savedFilters: SavedFilters,
    addFilters: (filters: AppliedFilter<AppliedFilterType>[]) => void;
    removeFilters: (filters: AppliedFilter<AppliedFilterType>[]) => void;
    saveCurrentFilters: (filterName: string) => void;
    removeSavedFilter: (filterName: string) => void;
    renameSavedFilter: (filterName: string, newFilterName: string) => boolean;
    loadSavedFilters: (filterName: string) => void;
    error: Error | undefined;
}