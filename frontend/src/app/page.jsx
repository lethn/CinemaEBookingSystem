"use client"
import NavBar from "./components/navBar";
import ComingSoon from "./components/comingSoon";
import NowPlaying from "./components/nowPlaying";
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

const Home = () => {
    const [currentMovies, setCurrentMovies] = useState();
    const [comingSoonMovies, setComingSoonMovies] = useState();

    // Get Current Movies From Database
    
    // fetching the json file works, but getting it into the useState or displaying the data does not
    // same code but inside of a useEffect is commeneted down below

    fetch('http://localhost:8080/movies')
    .then(response => response.json())
    .then(json => {
        console.log(json); // json is printed
        setCurrentMovies(json); // idk if this works
    })
    .catch((err) => {
        console.log(err.message);
    });
    
    
    /*
    useEffect(() => {
        const fetchMovies = async () => {
            fetch('http://localhost:8080/movies')
            .then(response => response.json())
            .then(json => {
                console.log(json);
                setCurrentMovies(json);
            })
            .catch((err) => {
                console.log(err.message);
            });
        };
        fetchMovies();
    }, []);
    */

    
    // Get Comming Soon Movies From Database


    // useEffect to re-render page

    return (
        <div>
            <NavBar/>
            <SearchBar/>

            <div>
                <NowPlaying/>
            </div>
            <div class="mt-10">
                <ComingSoon/>
            </div>
            <pre>
                {JSON.stringify(currentMovies, null, 2)}
            </pre>
        </div>
    );
}

export default Home;
