/* eslint-disable jsx-a11y/alt-text */
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { SearchProvider } from "../../../hooks/use-search";
import { getAllItemsAction } from "../../../stores/actions/item-actions";
import { PageableResults } from "../../../types/filters";
import item from "../../../types/responses/item-dto";
import SidebarFlter from "../../components/filters/sidebar";


const AllItemsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.item);

    const findItem = (): Promise<PageableResults<item>> => {
        dispatch(getAllItemsAction());

        return new Promise((resolve, reject) => {
            resolve({ itemCount: items.items?.length, results: items.items });
        });
    }
    
    return (
        <div>
            <SearchProvider<item> findItems={findItem} entityName='Test' searchOptions={{cacheTtlMins: 30, minCharactersToSearch: 3, debounceWaitMilliSecs: 250}}>
                <SidebarFlter />
            </SearchProvider>
        </div>
    );
}

export default AllItemsPage;