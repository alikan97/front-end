/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce } from "lodash";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppliedFilter, AppliedFilterType, EntityField, PageableResults, SavedFilters, SearchContextProps, SearchOptionsDefined, SearchSettings } from "../types/filters";
import { SearchProviderProps } from "../types/filters";
import { addLocalStorageItem, getLocalStorageItem, setLocalStorageItem } from "../utilities/local-storage";

const DEFAULT_SEARCH_OPTIONS: SearchOptionsDefined = {
    minCharactersToSearch: 3,
    debounceWaitMilliSecs: 350,
    cacheTtlMins: 30,
    savedFilterStorageKey: '',
};

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

export function SearchProvider<T>({ children, entityName, findItems, searchOptions }: SearchProviderProps<T>):JSX.Element {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<PageableResults<T>>();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchSettings, setSearchSettings] = useState<SearchSettings>(() => getLocalStorageItem('ENTITY-SEARCH', { itemsPerPage: 20 }));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const [filters, setFilters] = useState<AppliedFilter<AppliedFilterType>[]>([]);
    const [savedFilters, setSavedFilters] = useState<SavedFilters>(() => getLocalStorageItem(DEFAULT_SEARCH_OPTIONS.savedFilterStorageKey));
    const savedFilterStorageKey = `id-userId-${entityName}`;
    const clear = (): void => {
        setSearchText('');
        setCurrentPage(0);
        setSearchResults(undefined);
        setError(undefined);
    };

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

    const retrieveItems = async (text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[], settings: SearchSettings): Promise<void> => {
        setError(undefined);
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
        } catch (e) {
            setError(e as Error);
        }
        setIsLoading(false);
    }

    const isTextSearchable = (text: string): boolean => {
        return text.length >= 3; // Can retrieve this from a globally shared variable later on
    }

    const debouncedFindItems = useCallback(debounce(async (text: string, page: number, localFilters: AppliedFilter<AppliedFilterType>[], settings: SearchSettings) => {
        await retrieveItems(text, page, localFilters, settings);
    }, DEFAULT_SEARCH_OPTIONS.debounceWaitMilliSecs), []);

    useEffect(() => {
        if (!isTextSearchable(searchText)) {
            setSearchResults(undefined);
            setError(undefined);
            return;
        }
        
        setIsLoading(true);
        setCurrentPage(0);
        void debouncedFindItems(searchText, 0, filters, searchSettings);
    }, [searchText]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;

        setIsLoading(true);
        void retrieveItems(searchText, currentPage, filters, searchSettings);
    }, [currentPage]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;

        setIsLoading(true);
        setCurrentPage(0);
        void retrieveItems(searchText, 0, filters, searchSettings);
    }, [filters]);

    useEffect(() => {
        setLocalStorageItem(savedFilterStorageKey, savedFilters);
    }, [savedFilters]);

    useEffect(() => {
        if (!isTextSearchable(searchText)) return;
        addLocalStorageItem('ENTITY-SEARCH', { ...searchSettings });

        setIsLoading(true);
        setCurrentPage(0);
        void debouncedFindItems(searchText, 0, filters, searchSettings);
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
  