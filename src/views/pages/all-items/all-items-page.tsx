/* eslint-disable jsx-a11y/alt-text */
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { SearchProvider } from "../../../hooks/use-search";
import { getAllItemsAction } from "../../../stores/actions/item-actions";
import { PageableResults } from "../../../types/filters";
import item from "../../../types/responses/item-dto";
import SidebarFlter from "../../components/filters/sidebar";


const AllItemsPage: React.FC = () => {

    return (
        <div>
                <SidebarFlter />
        </div>
    );
}

export default AllItemsPage;