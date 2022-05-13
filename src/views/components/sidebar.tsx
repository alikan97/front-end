/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { SearchProvider, useEntitySearch } from "../../hooks/use-search";
import { getAllItemsAction } from "../../stores/actions/item-actions";
import { PageableResults } from "../../types/filters";
import item from "../../types/responses/item-dto";
import Checkbox from "./checkbox";

const Sidebar: React.FC = () => {
    const [active, setActive] = useState(true);
    const [checked, setChecked] = useState(false);
    const entitySearch = useEntitySearch();
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.item);
    const labels = ['First Label'];
console.log(entitySearch);
    const close = () => {
        setActive(!active);
    }

    const findItem = (): Promise<PageableResults<item>> => {
        dispatch(getAllItemsAction());

        return new Promise((resolve, reject) => {
            resolve({ itemCount: items.items?.length, results: items.items });
        });
    }

    return (
        <SearchProvider findItems={findItem} entityName='Items'>
            <div className="flex">
                <div className={`${active ? 'w-72' : 'w-20'} duration-200 h-screen bg-gray-200 relative rounded-r-lg`}>
                    <img src={require("../../assets/sidebar-icon.png")}
                        className={`absolute cursor-pointer rounded-lg -right-3 top-2 w-10 h-10 ${!active && "rotate-180"}`}
                        onClick={() => close()} />
                    <div>
                        <h1 className="text-black origin-left font-medium text-xl mt-8">
                            Filters:
                        </h1>
                        <Checkbox labels={labels} checked={checked} onChecked={() => setChecked(!checked)} />
                        <div className="mb-3 xl:w-96">
                            <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
                                <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"
                                value={entitySearch.searchText}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => entitySearch.setSearchText(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SearchProvider>
    );
}

export default Sidebar;
