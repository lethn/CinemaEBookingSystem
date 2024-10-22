"use client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./contexts/user"
import NavBar from "./components/navBar";
import ComingSoon from "./components/comingSoon";
import NowPlaying from "./components/nowPlaying";
import SearchBar from "./components/searchBar";
import axios from "axios";

const dummy_movies = [
    {
        id: 1,
        title: "Interstellar",
        category: "Science Fiction / Adventure",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        director: "Christopher Nolan",
        producer: "Emma Thomas, Christopher Nolan",
        synopsis: "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        picture: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        rating: "PG-13",
        nowPlaying: true
    },
    {
        id: 2,
        title: "Inception",
        category: "Science Fiction / Action",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        director: "Christopher Nolan",
        producer: "Emma Thomas, Christopher Nolan",
        synopsis: "A skilled thief who infiltrates the subconscious is offered a chance to have his past crimes erased in exchange for implanting an idea in someone's mind.",
        trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        picture: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg",
        rating: "PG-13",
        nowPlaying: true
    },
    {
        id: 3,
        title: "The Matrix",
        category: "Action / Martial Arts",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        director: "The Wachowskis",
        producer: "Joel Silver",
        synopsis: "A hacker discovers the reality he lives in is a simulation and joins a rebellion to free humanity from its controllers.",
        trailer: "https://www.youtube.com/watch?v=m8e-FF8MsqU",
        picture: "https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_SY679_.jpg",
        rating: "R",
        nowPlaying: false
    },
    {
        id: 4,
        title: "Avatar",
        category: "Action / Fantasy",
        cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
        director: "James Cameron",
        producer: "James Cameron, Jon Landau",
        synopsis: "A paraplegic Marine dispatched to the moon Pandora becomes torn between following orders and protecting the world he feels is his home.",
        trailer: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
        picture: "https://musicart.xboxlive.com/7/4d4d6500-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080",
        rating: "PG-13",
        nowPlaying: true
    },
    {
        id: 5,
        title: "Blade Runner 2049",
        category: "Science Fiction / Action",
        cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
        director: "Denis Villeneuve",
        producer: "Andrew A. Kosove, Broderick Johnson",
        synopsis: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        trailer: "https://www.youtube.com/watch?v=gCcx85zbxz4",
        picture: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        rating: "R",
        nowPlaying: false
    }
];

const Home = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [currentMovies, setCurrentMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [searchMovie, setSearchMovie] = useState("");
    const [searchType, setSearchType] = useState("title");

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/movies');
            const moviesData = response.data;
            console.log(response.data);
            console.log(isLoggedIn);
            console.log(userID);
            console.log(userType);

            // Filter the movies
            const current = moviesData.filter((movie) => movie.nowPlaying === true);
            const comingSoon = moviesData.filter((movie) => movie.nowPlaying === false);

            setCurrentMovies(current);
            setComingSoonMovies(comingSoon);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // useEffect(() => {
    //     // Filter the movies, if nowPlaying = true => current movies
    //     //                       nowPlaying = false => comming soon movies
    //     const current = dummy_movies.filter((movie) => movie.nowPlaying === true);
    //     const comingSoon = dummy_movies.filter((movie) => movie.nowPlaying === false);

    //     console.log(current);
    //     console.log(comingSoon);

    //     setCurrentMovies(current);
    //     setComingSoonMovies(comingSoon);
    // }, []);

    const filterMovies = (movies) => {
        if (!searchMovie) return movies; // If no search term, return all movies

        return movies.filter(movie => {
            if (searchType === "title") {
                return movie.title.toLowerCase().includes(searchMovie.toLowerCase());
            } else if (searchType === "category") {
                return movie.category.toLowerCase().includes(searchMovie.toLowerCase());
            }
            return false;
        });
    };

    return (
        <div>
            <NavBar userType={userType} />
            <SearchBar
                setSearchMovie={setSearchMovie}
                searchType={searchType}
                setSearchType={setSearchType}
            />

            <div className="my-8">
                <div className="flex items-center">
                    <div className="flex-grow border-2 border-navBarRed ml-4"></div>
                    <h2 className="text-2xl font-bold m-4 text-center">Now Playing</h2>
                    <div className="flex-grow border-2 border-navBarRed mr-4"></div>
                </div>
                <NowPlaying movies={filterMovies(currentMovies)} />
            </div>

            <div className="my-8">
                <div className="flex items-center">
                    <div className="flex-grow border-2 border-navBarRed ml-4"></div>
                    <h2 className="text-2xl font-bold m-4">Coming Soon</h2>
                    <div className="flex-grow border-2 border-navBarRed mr-4"></div>
                </div>
                <ComingSoon movies={filterMovies(comingSoonMovies)} />
            </div>
        </div>
    );
};

export default Home;
