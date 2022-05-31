import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import { PageableResults } from "../../types/filters";
import item from "../../types/responses/item-dto";
import Spinner from "./spinner";

const ResultsField: React.FC = () => {
    const [result, setResult] = useState<PageableResults<item>>({ itemCount: 0, results: [] });
    const item = useAppSelector(state => state.item);

    useEffect(() => {
        setResult(item.items);
    }, [item])

    if (item.loading) return <Spinner />;

    return (
        <>
            <div className="lg:col-span-5 mt-[65px] border-t border-gray-200">
                {result.results?.map((items, idx) => {
                    return <div key={idx}>
                        <div className="rounded-sm grid grid-cols-12 shadow p-3 my-2 gap-2 items-center hover:shadow-lg transition duration-200 hover:scale-105 transform">
                            <div className="col-span-10">
                                <p className="text-blue-600 font-semibold"> {items.name} </p>
                            </div>
                            <div className="col-span-10">
                                <p className="text-sm text-gray-800 font-light"> {items.id} </p>
                            </div>
                            <div className="col-span-2 col-start-12 text-center">
                                <p> ${items.price}</p>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </>
    );
};

export default ResultsField;
