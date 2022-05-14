import { useState } from "react";
import SortComponent from "./sort";

const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "thing", label: "Thing", checked: false },
      { value: "random", label: "Random", checked: false },
    ],
  },
  {
    id: "price",
    name: "Price",
    lowerLimit: 0,
    upperLimit: 100,
  },
  {
    id: "lastUpdated",
    name: "Last Updated",
    since: "2022/05/04 10:39",
  },
];

const SidebarFilter: React.FC = () => {
    const [active, setActive] = useState(false);

  return (
    <div className="bg-white">
      <div>
        <main className="max-w sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              All Items
            </h1>
            <div className="flex items-center">
              <SortComponent />
            </div>
          </div>
        </main>
        <div className="w-72 h-max border-r border-gray-200">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-900"
          >
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-900 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-200 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-900 sm:text-sm rounded-md"
              >
                <option>USD</option>
                <option>CAD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
          <label
            className="block text-sm font-medium text-gray-900 tracking-wide mb-2 pt-5"
            htmlFor="searchText"
          >
            Search for keyword
          </label>
          <input
            className="border-gray-200 rounded-md focus:border-indigo-500 block w-full py-3 px-4 mb-3 leading-tight focus:bg-white"
            id="searchText"
            type="text"
            placeholder="Keyword"
          />
            <div className="accordion-item bg-white border-b border-gray-200">
              <h2 className="accordion-header mb-0">
                <button
                  className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-900 text-left bg-white border-0 rounded-none focus:outline-none"
                  type="button"
                  onClick={() => setActive(!active)}
                >
                  Categories
                </button>
              </h2>
              <div
                id="collapseOne"
                className={`accordion-collapse ${active ? 'hidden' : ''} `}
              >
                <div className={`accordion-body py-4 px-5`}>
                  {filters[0].options?.map((filter) => {
                      return (
                          <p>
                              {filter.label}
                          </p>
                      )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SidebarFilter;
