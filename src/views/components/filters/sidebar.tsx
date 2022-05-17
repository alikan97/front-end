import { SearchProvider } from "../../../hooks/use-search";
import CategoryFilter from "./categoryFilter";
import PriceFilter from "./priceFilter";
import SearchBox from "./searchBox";
import SortComponent from "./sort";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { getAllItemsAction } from "../../../stores/actions/item-actions";
import { PageableResults } from "../../../types/filters";
import item from "../../../types/responses/item-dto";

const SidebarFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.item);

  const findItem = (): Promise<PageableResults<item>> => {
    dispatch(getAllItemsAction());

    return new Promise((resolve, reject) => {
      resolve({ itemCount: items.items?.length, results: items.items });
    });
  };
  return (
    <>
      <SearchProvider<item>
        findItems={findItem}
        entityName="Test"
        searchOptions={{
          cacheTtlMins: 30,
          minCharactersToSearch: 3,
          debounceWaitMilliSecs: 250,
        }}
      >
        <div className="bg-white">
          <div>
            <main className="max-w">
              <div className="relative z-10 flex items-baseline justify-between pb-6 border-b border-gray-200">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  All Items
                </h1>
                <div className="flex items-center">
                  <SortComponent />
                </div>
              </div>
            </main>
            <div className="w-72 px-2 h-screen sticky py-2 h-max border-r border-gray-200">
              <PriceFilter />
              <SearchBox />
              <CategoryFilter />
            </div>
          </div>
        </div>
      </SearchProvider>
    </>
  );
};

export default SidebarFilter;
