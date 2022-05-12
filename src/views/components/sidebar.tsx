/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";

const Sidebar: React.FC = () => {
    const [active, setActive] = useState(true);

    const close = () => {
        setActive(!active);
    }

    return (
        <div className="flex">
            <div className={`${active ? 'w-72' : 'w-20'} duration-200 h-screen bg-gray-200 relative rounded-r-lg`}>
                <img src={require("../../assets/sidebar-icon.png")}
                    className={`absolute cursor-pointer rounded-lg
                    -right-3 top-2 w-10 h-10 ${!active && "rotate-180"}`}
                    onClick={() => close()}/>

                <div>
                    <h1 className="text-black origin-left font-medium text-xl mt-8">
                        Filters:
                    </h1>
                    
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
