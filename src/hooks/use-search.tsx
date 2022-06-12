/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce, isUndefined, omitBy, values } from "lodash";
import moment from "moment";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Currency } from "../constants/enums";
import { DEFAULT_SEARCH_OPTIONS, staticCategories } from "../constants/globalConstants";
import { AppliedFilterType, PageableResults, SearchCache, SearchCacheItem, SearchContextProps, SearchOptionsDefined, AppliedFilter, FilterRequest } from "../types/filters";
import { SearchProviderProps } from "../types/filters";

export const SearchContext = createContext<SearchContextProps<any>>({
    searchText: { name: "Keyword", filter: { value: '' } },
    setSearchText: () => { },
    Categories: { name: "Categories", filter: { value: [] } },
    setCategories: () => { },
    price: { name: "Price", filter: { value: 0, optionalParams: { currency: Currency.AUD } } },
    setPrice: () => { },
    searchResults: undefined,
    currentPage: 0,
    setCurrentPage: () => { },
    clear: () => { },
    isLoading: false,
    error: undefined,
});

export function SearchProvider<T>({ children, entityName, findItems, searchOptions }: SearchProviderProps<T>): JSX.Element {
    const options: SearchOptionsDefined = {
        ...DEFAULT_SEARCH_OPTIONS,
        savedFilterStorageKey: `acc-id-${entityName}`,
        ...omitBy(searchOptions, isUndefined),
    };

    const [searchText, setSearchText] = useState<AppliedFilter<AppliedFilterType>>({ name: "Keyword", filter: { value: '' } });
    const [Categories, setCategories] = useState<AppliedFilter<AppliedFilterType>>({ name: "Categories", filter: { value: [] } });
    const [price, setPrice] = useState<AppliedFilter<AppliedFilterType>>({ name: "Price", filter: { value: 0, optionalParams: { currency: Currency.AUD } } });
    const [searchResults, setSearchResults] = useState<PageableResults<T>>();
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const clear = (): void => {
        setSearchText({ ...searchText, filter: { value: '' } });
        setCurrentPage(0);
        setSearchResults(undefined);
        setError(undefined);
    };

    const retrieveItems = async (text: string, page: number, localFilters: Record<string, AppliedFilter<AppliedFilterType>>): Promise<void> => {
        setError(undefined);
        try {
            const filters = {
                Categories: localFilters.CategoryFilter.filter.value as string[],
                price: localFilters.priceFilter.filter.value as number,
            }

            const pageableResults = await findItems(text, filters,
                {
                    skip: page * options.itemsPerPage,
                    limit: options.itemsPerPage
                });

            setSearchResults(pageableResults);
        } catch (e) {
            setError(e as Error);
        }
        setIsLoading(false);
    }

    const isTextSearchable = (text: string): boolean => {
        if (text.length === 0) return true;
        return text.length >= options.minCharactersToSearch;
    }

    const debouncedFindItems = useCallback(
        debounce(async (text: string, page: number, localFilters: Record<string, AppliedFilter<AppliedFilterType>>) => {
            await retrieveItems(text, page, localFilters);
        }, options.debounceWaitMilliSecs), []);

    useEffect(() => {
        setIsLoading(true);
        const combinedFilter: Record<string, AppliedFilter<AppliedFilterType>> = {
            CategoryFilter: Categories,
            priceFilter: price
        };

        setCurrentPage(0);
        void debouncedFindItems(searchText.filter.value as string, 0, combinedFilter);
    }, [price, Categories]);

    useEffect(() => {
        if (!isTextSearchable(searchText.filter.value as string)) {
            setSearchResults(undefined);
            setError(undefined);
            return;
        }
        setIsLoading(true);
        const combinedFilter: Record<string, AppliedFilter<AppliedFilterType>> = {
            CategoryFilter: Categories,
            priceFilter: price
        };
    
        setCurrentPage(0);
        void debouncedFindItems(searchText.filter.value as string, 0, combinedFilter);
    }, [searchText]);

    useEffect(() => {
        setIsLoading(true);

        const combinedFilter: Record<string, AppliedFilter<AppliedFilterType>> = {
            CategoryFilter: Categories,
            priceFilter: price
        };

        void retrieveItems(searchText.filter.value as string, currentPage, combinedFilter);
    }, [currentPage]);

    return (
        <SearchContext.Provider value={
            {
                searchText, setSearchText, searchResults, isLoading,
                currentPage, setCurrentPage, clear, Categories, setCategories, price, setPrice, error,
            }
        }>
            {children}
        </SearchContext.Provider>
    );
}

export const useEntitySearch = function <T>(): SearchContextProps<T> {
    return useContext<SearchContextProps<T>>(SearchContext);
};
