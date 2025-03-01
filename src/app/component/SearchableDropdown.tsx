import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Loader from "./Loader";

interface Props {
    options: any;
    selectedVal: any;
    handleChange?: (e: any) => void;
    handelOnKey?: (e: any) => void;
    placeholder?: string,
    lableValue?: string,
    loading?: boolean

}

const SearchableDropdown: React.FC<Props> = ({
    options,
    selectedVal,
    placeholder,
    handleChange = () => { },
    handelOnKey,
    lableValue,
    loading

}) => {
    const [query, setQuery] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.addEventListener("click", toggle);
        return () => document.removeEventListener("click", toggle);
    }, []);

    const selectOption = (option: any) => {
        setQuery(option?.lable);
        handleChange(option);
        setIsOpen((isOpen) => !isOpen);
    };

    function toggle(e: MouseEvent) {
        setIsOpen(e && e.target === inputRef.current);
    }

    const getDisplayValue = (): string => {
        if (query) return query;
        //if (selectedVal) return selectedVal?.value;

        return "";
    };

    const filter = (options: any) => {
        return options?.filter(
            (option: any) =>
                option?.value?.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    };

    return (
        <div className="dropdown relative text-gray-700">
            <label
                className="font-medium text-base text-[#444444] flex gap-2">
                {lableValue}
            </label>
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={getDisplayValue()}
                    placeholder={placeholder}
                    name="searchTerm"
                    onKeyDown={handelOnKey}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleChange(null);
                    }}
                    onClick={(e: any) => toggle(e)}
                    className="block w-full py-2 px-3 leading-tight focus:outline-none h-full text-lg border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 "
                />
                <div className={`absolute right-0 top-8`}>{loading ? <Loader /> : filter(options)?.length > 0 ?
                    isOpen ? <MdArrowDropUp size={24} /> : <MdArrowDropDown size={24} />
                    : <div onClick={() => handleChange(query)}><IoSearch size={22} className="text-sky-600 cursor-pointer" /></div>
                }
                </div>
            </div>

            <div className={`h-auto max-h-64 overflow-y-auto text-neutral-700 text-base w-full absolute z-10 font-sans transition-all placeholder-shown:border-blue-gray-200 bg-white border border-gray-300 rounded ${isOpen ? "" : "hidden"}`}>
                {filter(options)?.map((option: any, index: number) => {
                    return (
                        <div
                            onClick={() => selectOption(option)}
                            className={`text-neutral-700 px-2 py-0.5 cursor-pointer ${option?.lable === selectedVal?.lable ? "bg-neutral-200 text-neutral-800" : ""
                                }`}
                            key={index}
                        >
                            {option?.value}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchableDropdown;
