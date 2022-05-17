const SearchBox = () => {
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
        placeholder="Keyword"
      />
    </>
  );
};

export default SearchBox;
