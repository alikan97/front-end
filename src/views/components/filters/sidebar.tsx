import { SearchProvider } from "../../../hooks/use-search";
import CategoryFilter from "./categoryFilter";
import PriceFilter from "./priceFilter";
import SearchBox from "./searchBox";
import SortComponent from "./sort";
import { FilterRequest, PageableResults, pagination } from "../../../types/filters";
import item from "../../../types/responses/item-dto";
import ResultsField from "../results";
import Pagination from "../pagination";
import { itemsApi } from "../../../api/itemsApi";
import { useAuth } from "../../../hooks/use-auth";
import { AuthStatus } from "../../../types/auth";
import { itemsFakeData } from "../../../constants/stubData";

const SidebarFilter: React.FC = () => {
  const {state} = useAuth();

  const findItem = async (text: string, filters: FilterRequest, pagination: pagination): Promise<PageableResults<item>>=> {
    if (state?.status === AuthStatus.AUTHENTICATED) {
      const result = await itemsApi.getitems(state?.axios, pagination.skip, pagination.limit, text, filters);
      return { itemCount: result?.itemsCount, results: result?.data};
    }
    return Promise.resolve({itemCount: itemsFakeData.length, results: itemsFakeData});
  };

  return (
    <>
      <SearchProvider<item>
        findItems={findItem}
        entityName="Test"
        itemsPerPage={6}
        searchOptions={{
          cacheTtlMins: 30,
          minCharactersToSearch: 3,
          debounceWaitMilliSecs: 250,
        }}
      >
        <div className="bg-white grid grid-cols-6 gap-y-10">
          <div className="col-span-1">
            <main className="max-w border-b border-gray-200">
              <div className="relative z-10 flex items-baseline justify-between pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  All Items
                </h1>
                <div className="flex items-center">
                  <SortComponent />
                </div>
              </div>
            </main>
            <div className="w-72 px-2 h-screen absolute sticky py-2 h-max">
              <PriceFilter />
              <SearchBox />
              <CategoryFilter />
            </div>
          </div>
          <ResultsField />
        </div>
        <Pagination itemsPerPage={5}/>
      </SearchProvider>
    </>
  );
};

export default SidebarFilter;
