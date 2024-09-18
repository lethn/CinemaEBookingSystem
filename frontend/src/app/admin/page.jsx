"use client"
import NavBarAdmin from "../components/navBarAdmin";
import SearchBar from "../components/searchBar";

export default function Home() {
    return (
        <div>
            <NavBarAdmin/>
            <SearchBar/>

            <div>
                Currently Running Movies
            </div>

            <div>
                Coming Soon Movies
            </div>

        </div>
    );
}