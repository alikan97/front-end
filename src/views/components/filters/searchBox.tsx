import { useEffect, useState } from "react";
import { useEntitySearch } from "../../../hooks/use-search";

const SearchBox = () => {
  const [searchText, setSearchText] = useState({ value: '' });
  const search = useEntitySearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText({ value: e.target.value });
  }

  useEffect(() => {
    search.setSearchText({ ...search.searchText, filter: searchText });
  }, [searchText]);

  return (
    <>
      <label
        className="block text-sm font-medium text-gray-900 tracking-wide mb-2 pt-5"
        htmlFor="searchText"
      >
        Search by keyword
      </label>
      <input
        className="border-gray-200 rounded-md focus:border-indigo-500 block w-full py-3 px-4 mb-3 leading-tight focus:bg-white"
        id="searchText"
        type="text"
        value={searchText.value}
        onChange={(e) => handleChange(e)}
        placeholder="Keyword"
      />
    </>
  );
};

export default SearchBox;
