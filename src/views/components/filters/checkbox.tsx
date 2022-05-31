import { useEffect, useState } from "react";
import { useEntitySearch } from "../../../hooks/use-search";

interface IProps {
  labels: string[];
}

const Checkbox = ({ labels }: IProps) => {
  const [categories, setCategories] = useState<Array<string>>([]);
  const search = useEntitySearch();

  const handleChange = (label: string) => {
    if (categories.includes(label)) {
      const temp = categories.filter((l) => l !== label);
      setCategories(temp);
    } else {
      const temp = [...categories];
      temp.push(label);
      setCategories(temp);
    }
  }

  useEffect(() => {
    search.setCategories({name: 'Categories', filter: { value: categories }});
  }, [categories]);

  return (
    <div className="block justify-center">
      {labels.map((label, idx) => {
        return (
          <div className="form-check" key={idx}>
            <input
              className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={categories.includes(label) ? true : false}
              onChange={(_) => handleChange(label)}
              id="flexCheckDefault"
            />
            <label
              className="form-check-label inline-block text-gray-800"
              htmlFor="flexCheckDefault"
            >
              {label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Checkbox;
