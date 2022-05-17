/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce, isUndefined, omitBy, values } from "lodash";
import moment from "moment";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Currency } from "../constants/enums";
import { DEFAULT_SEARCH_OPTIONS } from "../constants/globalConstants";
import { AppliedFilterType, PageableResults, SearchCache, SearchCacheItem, SearchContextProps, SearchOptionsDefined, SearchSettings, AppliedFilter } from "../types/filters";
import { SearchProviderProps } from "../types/filters";
import { addLocalStorageItem, getLocalStorageItem, setLocalStorageItem } from "../utilities/local-storage";

export const SearchContext = createContext<SearchContextProps<any>>({
    searchText: {name: "Keyword", filter: { value: ''}},
    setSearchText: () => { },
    Categories: {name: "Categories", filter: { value: [] }},
    setCategories: () => { },
    price: {name: "Price", filter: { value: 0, optionalParams: { currency: Currency.AUD }}},
    setPrice: () => { },
    searchResults: undefined,
    searchSettings: { itemsPerPage: 0 },
    setSearchSettings: () => { },
    currentPage: 0,
    setCurrentPage: () => { },
    clear: () => { },
    isLoading: false,
    savedFilters: {},
    error: undefined,
});

export function SearchProvider<T>({ children, entityName, findItems, searchOptions }: SearchProviderProps<T>): JSX.Element {
    const options: SearchOptionsDefined = {
        ...DEFAULT_SEARCH_OPTIONS,
        savedFilterStorageKey: `acc-id-${entityName}`,
        ...omitBy(searchOptions, isUndefined),
      };
    
    const [searchText, setSearchText] = useState<AppliedFilter<AppliedFilterType>>({name: "Keyword", filter: { value: ''}});
    const [Categories, setCategories] = useState<AppliedFilter<AppliedFilterType>>({name: "Categories", filter: { value: [] }});
    const [price, setPrice] = useState<AppliedFilter<AppliedFilterType>>({name: "Price", filter: { value: 0, optionalParams: { currency: Currency.AUD }}});
    const [searchResults, setSearchResults] = useState<PageableResults<T>>();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchSettings, setSearchSettings] = useState<SearchSettings>(() => getLocalStorageItem('ENTITY-SEARCH', { itemsPerPage: 20 }));
    const [isLoading, setIsLoading] = useState(false);
    const [searchCache, setSearchCache] = useState<SearchCache<PageableResults<T>>>({});
    const [error, setError] = useState<Error>();
    const [savedFilters, setSavedFilters] = useState<Record<string, AppliedFilter<AppliedFilterType>[]>>(() => getLocalStorageItem(options.savedFilterStorageKey as string));

    const clear = (): void => {
        setSearchText({...searchText, filter: {value: ''}});
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
        return moment().diff(cachedResult.expiry, 'm') > 0;
    }

    const getCacheData = (cache: SearchCache<PageableResults<T>>, key1: string, key2: string): PageableResults<T> | undefined => {
        const cacheItem = cache[key1]?.[key2];
        if (!isValidCachedResult(cacheItem)) return;

        return cacheItem.data;
    }

    const saveCurrentFilters = (filterName: string): void => {
        setSavedFilters( {...savedFilters, [filterName]: [searchText, Categories, price] });
    };

    const invalidateCache = (): void => {
        setSearchCache({});
    }

    const retrieveItems = async (cache: SearchCache<PageableResults<T>>, text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[], settings: SearchSettings): Promise<void> => {
        setError(undefined);

        const cachedResult = getCacheData(cache, text, page.toString());
        if (cachedResult) {
            setSearchResults(cachedResult);
        } else {
            try {
                const mongoFilters = Object.entries(localFilters).reduce((acc, [filterName, appliedFilters]) => {
                    acc.$and.push({ [filterName]: appliedFilters.filter.value})
                    return acc;
                }, { '$and': [] } as { '$and': Record<string, unknown>[] });

                const pageableResults = await findItems(text, mongoFilters,
                    {
                        skip: page * settings.itemsPerPage,
                        limit: settings.itemsPerPage
                    });
                setSearchResults(pageableResults);
                setCacheData(cache, text, page.toString(), pageableResults);
            } catch (e) {
                setError(e as Error);
            }
        }
        setIsLoading(false);
    }

    const isTextSearchable = (text: string): boolean => {
        return text.length >= options.minCharactersToSearch;
    }

    const debouncedFindItems = useCallback(
        debounce(async (cache: SearchCache<PageableResults<T>>, text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[], settings: SearchSettings) => {
            await retrieveItems(cache, text, page, localFilters, settings);
        }, options.debounceWaitMilliSecs), []);

    useEffect(() => {
        if (!isTextSearchable(searchText.filter.value as string)) {
            setSearchResults(undefined);
            setError(undefined);
            return;
        }
        console.log(price);
        setIsLoading(true);
        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];
        setCurrentPage(0);
        void debouncedFindItems(searchCache, searchText.filter.value as string, 0, combinedFilter, searchSettings);
    }, [price]);

    useEffect(() => {
        if (!isTextSearchable(searchText.filter.value as string)) return;        
        setIsLoading(true);

        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];
        void retrieveItems(searchCache, searchText.filter.value as string, currentPage, combinedFilter, searchSettings);
    }, [currentPage]);

    useEffect(() => {
        setLocalStorageItem(options.savedFilterStorageKey as string, savedFilters);
    }, [savedFilters]);

    useEffect(() => {
        if (!isTextSearchable(searchText.filter.value as string)) return;
        addLocalStorageItem('ENTITY-SEARCH', { ...searchSettings });

        setIsLoading(true);
        const combinedFilter: AppliedFilter<AppliedFilterType>[] = [
            searchText,
            Categories,
            price
        ];

        invalidateCache();
        setCurrentPage(0);
        void debouncedFindItems({}, searchText.filter.value as string, 0, combinedFilter, searchSettings);
    }, [searchSettings]);

    return (
        <SearchContext.Provider value={
            {
                searchText, setSearchText, searchResults, isLoading, searchSettings, setSearchSettings,
                currentPage, setCurrentPage, clear, savedFilters, Categories, setCategories, price, setPrice, error,
            }
        }>
            {children}
        </SearchContext.Provider>
    );
}

export const useEntitySearch = function <T>(): SearchContextProps<T> {
    return useContext<SearchContextProps<T>>(SearchContext);
};
