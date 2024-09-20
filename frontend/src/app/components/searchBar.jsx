"use client"
import {useRouter} from 'next/navigation';
import {useState} from 'react';

const SearchBar = ({onSearch}) => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    
    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(search);
        }

        router.push("/search-result");
    };

    return (
        <div className="flex items-center justify-center m-10">
            <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Search Movies..."
                className="text-black w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
            Search
            </button>
        </div>
    );
}

export default SearchBar