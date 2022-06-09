import { useState } from "react";
import Checkbox from "./checkbox";

const CategoryFilter = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="accordion-item bg-white border-b border-gray-200">
      <h2 className="accordion-header mb-0">
        <button
          className="accordion-button text-sm font-medium relative flex items-center w-full py-2 text-gray-900 text-left bg-white border-0 rounded-none focus:outline-none"
          type="button"
          onClick={() => setActive(!active)}
        >
          Categories
        </button>
      </h2>
      <div
        id="collapseOne"
        className={`accordion-collapse ${active ? "" : "hidden"}`}
      >
        <div className={`accordion-body py-4`}>
          <Checkbox />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
