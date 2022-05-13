export const getLocalStorageItem = <T>(key: string, defaultValue: T = {} as T): T => {
    const localStoreValue = localStorage.getItem(key);
    return localStoreValue ? JSON.parse(localStoreValue) as T : defaultValue;
};

export const addLocalStorageItem = (key: string, value: Record<string, unknown>): void => {
    localStorage.setItem(key, JSON.stringify({
      ...getLocalStorageItem(key),
      ...value,
    }));
  };

export const setLocalStorageItem = (key: string, value: Record<string, unknown>): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };