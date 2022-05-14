/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce, isUndefined, omitBy } from "lodash";
import moment from "moment";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_SEARCH_OPTIONS } from "../constants/search";
import { AppliedFilter, AppliedFilterType, EntityField, PageableResults, SavedFilters, SearchCache, SearchCacheItem, SearchContextProps, SearchOptionsDefined, SearchSettings } from "../types/filters";
import { SearchProviderProps } from "../types/filters";
import { addLocalStorageItem, getLocalStorageItem, setLocalStorageItem } from "../utilities/local-storage";

export const SearchContext = createContext<SearchContextProps<any>>({
    searchText: '',
    setSearchText: () => { },
    searchResults: undefined,
    searchSettings: { itemsPerPage: 0 },
    setSearchSettings: () => { },
    currentPage: 0,
    setCurrentPage: () => { },
    clear: () => { },
    isLoading: false,
    filters: [],
    savedFilters: {},
    addFilters: () => { },
    removeFilters: () => { },
    saveCurrentFilters: () => { },
    removeSavedFilter: () => { },
    loadSavedFilters: () => { },
    renameSavedFilter: () => false,
    error: undefined,
});

export function SearchProvider<T>({ children, entityName, findItems, searchOptions }: SearchProviderProps<T>): JSX.Element {
    const options: SearchOptionsDefined = {
        ...DEFAULT_SEARCH_OPTIONS,
        savedFilterStorageKey: `acc-id-${entityName}`,
        ...omitBy(searchOptions, isUndefined),
      };
    
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<PageableResults<T>>();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchSettings, setSearchSettings] = useState<SearchSettings>(() => getLocalStorageItem('ENTITY-SEARCH', { itemsPerPage: 20 }));
    const [isLoading, setIsLoading] = useState(false);
    const [searchCache, setSearchCache] = useState<SearchCache<PageableResults<T>>>({});
    const [error, setError] = useState<Error>();
    const [filters, setFilters] = useState<AppliedFilter<AppliedFilterType>[]>([]);
    const [savedFilters, setSavedFilters] = useState<SavedFilters>(() => getLocalStorageItem(options.savedFilterStorageKey));

    const clear = (): void => {
        setSearchText('');
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

    const invalidateCache = (): void => {
        setSearchCache({});
    }

    const addFilters = (filtersToAdd: AppliedFilter<AppliedFilterType>[]): void => {
        setFilters([
            ...filters,
            ...filtersToAdd
        ]);
    };

    const removeFilters = (filtersToRemove: AppliedFilter<AppliedFilterType>[]): void => {
        setFilters(filters.filter((f) => !filtersToRemove.includes(f)));
    }

    const saveCurrentFilters = (filterName: string): void => {
        setSavedFilters({ ...savedFilters, [filterName]: { filters, created: new Date().getUTCMilliseconds() } });
    };

    const removeSavedFilter = (filterName: string): void => {
        setSavedFilters(Object.entries(savedFilters).reduce((acc, [name, value]) => {
            // if filterName match return current state (accumulator)
            if (filterName === name) return acc;
            // else, take next element
            acc[name] = value;
            return acc;
        }, {} as SavedFilters));
    }

    const renameSavedFilter = (filterName: string, newFilterName: string): boolean => {
        if (savedFilters[newFilterName]) return false;

        const filterCopy = { ...savedFilters };
        filterCopy[newFilterName] = filterCopy[filterName];
        delete filterCopy[filterName];
        setSavedFilters(filterCopy);
        return true;
    }

    const loadSavedFilters = (filterName: string): void => {
        setFilters(savedFilters[filterName].filters);
    }

    const retrieveItems = async (cache: SearchCache<PageableResults<T>>, text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[], settings: SearchSettings): Promise<void> => {
        setError(undefined);

        const cachedResult = getCacheData(cache, text, page.toString());
        if (cachedResult) {
            setSearchResults(cachedResult);
        } else {
            try {
                const groupedFilters = localFilters.reduce((acc, filter) => {
                    if (!acc[filter.propertyPath]) {
                        acc[filter.propertyPath] = [];
                    }
                    acc[filter.propertyPath].push(filter);
                    return acc;
                }, {} as Record<string, AppliedFilter<AppliedFilterType>[]>);

                const mongoFilters = Object.entries(groupedFilters).reduce((acc, [filterName, appliedFilters]) => {
                    if (appliedFilters.length === 1) {
                        acc.$and.push({ [filterName]: appliedFilters[0].definition.type === 'entity' ? (appliedFilters[0].value as EntityField).id : appliedFilters[0].value });
                    } else {
                        acc.$and.push({ '$or': appliedFilters.map((filter) => ({ [filterName]: filter.definition.type === 'entity' ? (filter.value as EntityField).id : filter.value })) });
                    }
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
        if (!isTextSearchable(searchText)) {
            setSearchResults(undefined);
            setError(undefined);
            return;
        }

        setIsLoading(true);
        setCurrentPage(0);
        void debouncedFindItems(searchCache, searchText, 0, filters, searchSettings);
    }, [searchText]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;

        setIsLoading(true);
        void retrieveItems(searchCache, searchText, currentPage, filters, searchSettings);
    }, [currentPage]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;

        setIsLoading(true);
        invalidateCache();
        setCurrentPage(0);
        void retrieveItems(searchCache, searchText, 0, filters, searchSettings);
    }, [filters]);

    useEffect(() => {
        setLocalStorageItem(options.savedFilterStorageKey, savedFilters);
    }, [savedFilters]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;
        addLocalStorageItem('ENTITY-SEARCH', { ...searchSettings });

        setIsLoading(true);
        invalidateCache();
        setCurrentPage(0);
        void debouncedFindItems({}, searchText, 0, filters, searchSettings);
    }, [searchSettings]);

    return (
        <SearchContext.Provider value={
            {
                searchText, setSearchText, searchResults, isLoading, searchSettings, setSearchSettings,
                currentPage, setCurrentPage, clear, filters, savedFilters, addFilters, removeFilters,
                saveCurrentFilters, removeSavedFilter, renameSavedFilter, loadSavedFilters, error,
            }
        }>
            {children}
        </SearchContext.Provider>
    );
}

export const useEntitySearch = function <T>(): SearchContextProps<T> {
    return useContext<SearchContextProps<T>>(SearchContext);
};
