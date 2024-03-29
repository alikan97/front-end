import { useEffect, useState } from "react";
import { useEntitySearch } from "../../hooks/use-search";

interface IProps {
    itemsPerPage: number
}

const Pagination = ({itemsPerPage}: IProps) => {
    const [pages, setPages] = useState<number>(0);
    const search = useEntitySearch();

    useEffect(() => {
        if (search.searchResults) {
            setPages(Math.floor((search.searchResults.itemCount)/itemsPerPage));
        }
    }, [search.searchResults]);

    return (
        <div className="flex justify-center">
            <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                    <li className="page-item">
                        <p className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 focus:shadow-none cursor-pointer"
                        aria-label="Previous"
                        onClick={() => {search.setCurrentPage(search.currentPage > 0 ? search.currentPage-1 : 0)}}>
                        <span aria-hidden="true">&laquo;</span>
                    </p></li>
                    {Array(pages).fill(0).map((_, idx: number) => {
                        return (
                            <li className="page-item" key={idx}>
                                <p className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
                                onClick={() => {search.setCurrentPage(idx)}}
                                >
                                    {idx + 1}
                                </p>
                            </li>
                        )
                    })}
                    <li className="page-item">
                        <p className="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none cursor-pointer"
                        aria-label="Next"
                        onClick={() => {search.setCurrentPage((search.currentPage+1) < pages ? search.currentPage+1 : pages-1)}}
                        >
                        <span aria-hidden="true">&raquo;</span>
                    </p></li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination;