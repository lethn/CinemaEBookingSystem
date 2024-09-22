"use client"
import { useState } from 'react';

const SearchBar = ({ setSearchMovie, searchType, setSearchType }) => {
    const [search, setSearch] = useState(""); // State to store input locally

    const handleInputChange = (e) => {
        setSearch(e.target.value); // Update the search term on input change
    };

    const handleDropdownChange = (e) => {
        setSearchType(e.target.value); // Update the search type (title/category)
    };

    const onClickSearchQueryHandler = () => {
        setSearchMovie(search); // Call searchMovie to update the search term in the parent component
    };

    return (
        <div className="flex items-center justify-center m-10">
            <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Search Movie"
                className="text-black w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                value={searchType}
                onChange={handleDropdownChange}
                className="text-black ml-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="title">Title</option>
                <option value="category">Category</option>
            </select>
            <button
                onClick={onClickSearchQueryHandler}
                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
                Search
            </button>
        </div>
    );
}

export default SearchBar;
