import { useEffect, useState } from "react";
import { useEntitySearch } from "../../../hooks/use-search";
import { Currency } from "../../../constants/enums";
import { AppliedFilter, AppliedFilterType } from "../../../types/filters";

const PriceFilter = () => {
  const [priceFilter, setPriceFilter] = useState<AppliedFilter<AppliedFilterType>>({
    name: "price-filter",
    filter: {
      value: 0,
      optionalParams: {
        currency: Currency.AUD
      }
    }
  });

  const search = useEntitySearch();

  useEffect(() => {
    search.setPrice(priceFilter);
  }, [priceFilter]);

  const handleCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceFilter({name: "price-filter", filter: { ...priceFilter.filter, optionalParams: { currency: e.target.value as Currency} }});
  };

  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceFilter({name: "price-filter", filter: { ...priceFilter.filter, value: e.target.value }});
  };

  return (
    <>
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
          type="number"
          name="price"
          id="price"
          value={priceFilter.filter.value}
          onChange={(e) => handlePrice(e)}
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
            value={priceFilter.filter.optionalParams?.currency}
            onChange={(e) => handleCurrency(e)}
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-900 sm:text-sm rounded-md"
          >
            <option>USD</option>
            <option>AUD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
