import { useState } from "react";

type Props = {
    setSearch: (searchText?: string) => void;
}
export const SearchInput = ({setSearch}: Props) => {
    const [searchText, setSearchText] = useState("");

    return (
        <>
        <label className="flex rounded-xl bg-yellow-50 py-2 px-5 my-2">
            Search by name:
            <input 
                name="searchInput" 
                value={searchText} 
                onChange={e => {
                    setSearchText(e.target.value);
                    setSearch(e.target.value);
                }}
                className="bg-gray-50 rounded py-1 px-2 focus:outline-1 focus:bg-gray-50"
                />
        </label>
        </>
    );
}