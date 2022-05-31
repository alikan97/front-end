/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce, isUndefined, omitBy, values } from "lodash";
import moment from "moment";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Currency } from "../constants/enums";
import { DEFAULT_SEARCH_OPTIONS } from "../constants/globalConstants";
import { AppliedFilterType, PageableResults, SearchCache, SearchCacheItem, SearchContextProps, SearchOptionsDefined, AppliedFilter } from "../types/filters";
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

export function SearchProvider<T>({ children, entityName, findItems, itemsPerPage, searchOptions }: SearchProviderProps<T>): JSX.Element {
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
    const [searchCache, setSearchCache] = useState<SearchCache<PageableResults<T>>>({});
    const [error, setError] = useState<Error>();

    const clear = (): void => {
        setSearchText({ ...searchText, filter: { value: '' } });
        setCurrentPage(0);
        setSearchResults(undefined);
        setError(undefined);
    };

    const setCacheData = (cache: SearchCache<PageableResults<T>>, key1: string, key2: string, data: PageableResults<T>): void => {
        setSearchCache({
            ...cache,
            [key1]: {
                ...cache[key1],
                [key2]: {
                    data,
                    expiry: moment().add(options.cacheTtlMins ?? 30, 'm').toDate(),
                },
            },
        });
    };

    const isValidCachedResult = (cachedResult: SearchCacheItem<PageableResults<T>> | undefined): boolean => {
        if (!cachedResult) return false;
        return moment().diff(cachedResult.expiry, 'm') < 0;
    }

    const getCacheData = (cache: SearchCache<PageableResults<T>>, key1: string, key2: string): PageableResults<T> | undefined => {
        const cacheItem = cache[key1]?.[key2];
        if (!isValidCachedResult(cacheItem)) return;

        return cacheItem.data;
    }

    const invalidateCache = (): void => {
        setSearchCache({});
    }

    const retrieveItems = async (cache: SearchCache<PageableResults<T>>, text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[]): Promise<void> => {
        setError(undefined);

        try {
            const mongoFilters = Object.entries(localFilters).reduce((acc, [_filterName, appliedFilters]) => {
                acc.$and.push({ [appliedFilters.name]: appliedFilters.filter.value });
                return acc;
            }, { '$and': [] } as { '$and': Record<string, unknown>[] });

            const pageableResults = await findItems(text, mongoFilters,
                {
                    skip: page * itemsPerPage,
                    limit: itemsPerPage
                });

            setSearchResults(pageableResults);
            setCacheData(cache, text, page.toString(), pageableResults);
        } catch (e) {
            setError(e as Error);
        }

        setIsLoading(false);
    }

    const isTextSearchable = (text: string): boolean => {
        return text.length >= options.minCharactersToSearch;
    }

    const debouncedFindItems = useCallback(
        debounce(async (cache: SearchCache<PageableResults<T>>, text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[]) => {
            await retrieveItems(cache, text, page, localFilters);
        }, options.debounceWaitMilliSecs), []);

    useEffect(() => {
        setIsLoading(true);
        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];

        invalidateCache();
        setCurrentPage(0);
        void debouncedFindItems(searchCache, searchText.filter.value as string, 0, combinedFilter);
    }, [price, Categories]);

    useEffect(() => {
        if (!isTextSearchable(searchText.filter.value as string)) {
            setSearchResults(undefined);
            setError(undefined);
            return;
        }
        setIsLoading(true);
        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];
        setCurrentPage(0);
        void debouncedFindItems(searchCache, searchText.filter.value as string, 0, combinedFilter);
    }, [searchText]);

    useEffect(() => {
        setIsLoading(true);

        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];
        void retrieveItems(searchCache, searchText.filter.value as string, currentPage, combinedFilter);
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
