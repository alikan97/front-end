import { SearchOptionsDefined } from "../types/filters";

export const DEFAULT_SEARCH_OPTIONS: SearchOptionsDefined = {
  minCharactersToSearch: 3,
  debounceWaitMilliSecs: 350,
  cacheTtlMins: 30,
  savedFilterStorageKey: "savedFilter",
  itemsPerPage: 6,
};

export const staticCategories = ['first', 'second', 'thing', 'Random', 'Shit'];