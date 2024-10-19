// SearchBar.js
"use client"
import { useState } from 'react';

const SearchBar = ({ setSearchMovie, searchType, setSearchType }) => {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState(searchType);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleDropdownChange = (e) => {
        setSelectedType(e.target.value);
    };

    const onClickSearchQueryHandler = () => {
        setSearchType(selectedType);
        setSearchMovie(search);
    };

    return (
        <div className="flex items-center justify-center m-10">
            <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Search Movie"
                className="text-black w-64 p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <select
                value={selectedType}
                onChange={handleDropdownChange}
                className="text-black ml-3 p-2 border border-gray-300 rounded-lg focus:outline-none"
            >
                <option value="title">Title</option>
                <option value="category">Genre</option>
            </select>
            <button
                onClick={onClickSearchQueryHandler}
                className="ml-3 px-4 py-2 bg-red-600 text-white p-3 rounded-md hover:bg-red-800 transition duration-300 ease-in-out"
            >
                Search
            </button>
        </div>
    );
}

export default SearchBar;
