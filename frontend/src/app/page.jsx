"use client"
import NavBar from "./components/navBar";
import SearchBar from "./components/searchBar";
import {useState, useEffect} from "react";

// Dummy data for movies
const movies = [
    {
        id: 1,
        title: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
        trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
        category: "Currently Running"
    },
    {
        id: 2,
        title: "Spider-Man: Far From Home",
        description: "Following the events of Avengers: Endgame, Spider-Man must step up.",
        trailerUrl: "https://www.youtube.com/embed/Nt9L1jCKGnE",
        category: "Coming Soon"
    },
    {
        id: 3,
        title: "The Lion King",
        description: "After the murder of his father, a young lion prince flees his kingdom.",
        trailerUrl: "https://www.youtube.com/embed/7TavVZMewpY",
        category: "Currently Running"
    }
];

export default function Home() {
    const [currentMovies, setCurrentMovies] = useState();
    const [comingSoonMovies, setComingSoonMovies] = useState();


    // Get Current Movies From Database
    fetch('http://localhost:8080/movies')
    .then(response => response.json())
    .then(json => {
        console.log(json);
        setCurrentMovies(json);
    })
    .catch((err) => {
        console.log(err.message);
    });
    // Get Comming Soon Movies From Database


    // useEffect to re-render page


    return (
        <div>
            <NavBar/>
            <SearchBar/>

            <div>
                Currently Running Movies
            </div>
            <pre>
                Data: {JSON.stringify(currentMovies, null, 2)}
            </pre>

            <div>
                Coming Soon Movies
            </div>

        </div>
    );
}
