import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { itemsApi } from "../../../api/itemsApi";
import { useAuth } from "../../../hooks/use-auth";
import { AuthStatus } from "../../../types/auth";
import { createItemState } from "../../../types/requests/create-item-dto";
import { createItemResponse } from "../../../types/responses/create-item-response";
import Alert, { ThemeTypes } from "../../components/alerts";
import Spinner from "../../components/spinner";
import Modal, { ModalThemes } from "../../components/modal";

const RequestItemPage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [category, setCategory] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [resp, setResp] = useState<createItemResponse>();

    const [modal, setModal] = useState(false);

    const auth = useAuth();

    const handleFormSubmit = async () => {
        if (auth.state?.status !== AuthStatus.AUTHENTICATED) return;

        setLoading(true);
        const createItemDto: createItemState = {
            Name: name,
            Price: price as number, // will always be a number thanks to UI enforcing
            Category: category,
        };
        const response = await itemsApi.createItem(auth.state.axios, createItemDto);
        setResp(response);
        setLoading(false);
    }

    useEffect(() => {
        if (resp !== undefined && resp !== null) {
            setModal(true);
        }
    }, [resp]);

    return (
        <div className="block">
            {auth.state?.status !== AuthStatus.AUTHENTICATED ? <div className="flex justify-center"> <Alert theme={ThemeTypes.warn} title={'Not Authenticated'} description={"You cannot create item if you are not authenticated"} /> </div> : null}
            {loading ? <Spinner /> :
                <div className="max-w-2xl mx-auto bg-white p-16">
                    {modal === true ? <Modal theme={ModalThemes.success} description={resp} modalState={modal} setModalState={setModal} /> :
                        <form onSubmit={() => handleFormSubmit()}>
                            <div className="grid gap-6 mb-6 lg:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Item name</label>
                                    <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setName(e.target.value)} value={name} placeholder="Item name" required />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Price</label>
                                    <input type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPrice(parseInt(e.target.value))} value={price} placeholder="Price" required />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Category</label>
                                    <input type="text" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setCategory(e.target.value)} value={category} placeholder="Category" required />
                                </div>
                                <div>
                                    <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Amount</label>
                                    <input type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Amount" />
                                </div>
                                <div>
                                    <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Brand</label>
                                    <input type="text" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Brand" />
                                </div>
                                <div>
                                    <label htmlFor="size" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Item size</label>
                                    <input type="text" id="size" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Item size (S, M, L...)" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Description</label>
                                <input type="text" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Short item description" />
                            </div>
                            <div className="flex items-start mb-6">
                                <div className="flex items-center h-5">
                                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
                                </div>
                                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400"> Item editable by others ?</label>
                            </div>
                            <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </form>
                    }
                </div>
            }
        </div>
    );
}

export default RequestItemPage;