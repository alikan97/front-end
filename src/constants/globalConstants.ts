import { SearchOptionsDefined } from "../types/filters";

export const DEFAULT_SEARCH_OPTIONS: SearchOptionsDefined = {
  minCharactersToSearch: 3,
  debounceWaitMilliSecs: 350,
  cacheTtlMins: 30,
  savedFilterStorageKey: "savedFilter",
};
