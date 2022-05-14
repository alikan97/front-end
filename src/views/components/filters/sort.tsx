import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "../../../utilities/classNames";

interface ISortOptions {
    name: string,
    href: string,
    current: boolean
}

export const SortComponent:React.FC= () => {
    const sortOptions = [
        { name: "Price: Low to High", href: "#", current: false },
        { name: "Price: High to Low", href: "#", current: false },
    ];
    
    const handle = (option: ISortOptions) => {
        option.current = true;
        console.log(option);
    }

    return (
        <>
            
        </>
    );
}

export default SortComponent;