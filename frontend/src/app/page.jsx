"use client";
import { useState, useEffect } from "react";
import NavBar from "./components/navBar";
import ComingSoon from "./components/comingSoon";
import NowPlaying from "./components/nowPlaying";
import SearchBar from "./components/searchBar";

const dummy_movies = [
    {
        id: 1,
        title: "Interstellar",
        category: "Science Fiction",
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
        category: "Science Fiction",
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
        category: "Science Fiction",
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
        category: "Science Fiction",
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
        category: "Science Fiction",
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
    const [currentMovies, setCurrentMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);

    // const fetchMovies = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/movies');
    //         const moviesData = response.data;
    //         console.log(response.data);

    //         // Filter the movies
    //         const current = moviesData.filter((movie) => movie.nowPlaying === true);
    //         const comingSoon = moviesData.filter((movie) => movie.nowPlaying === false);

    //         setCurrentMovies(current);
    //         setComingSoonMovies(comingSoon);
    //     } catch (error) {
    //         console.error('Error fetching movies:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchMovies();
    // }, []);

    useEffect(() => {
        // Filter the movies, if nowPlaying = true => current movies
        //                       nowPlaying = false => comming soon movies
        const current = dummy_movies.filter((movie) => movie.nowPlaying === true);
        const comingSoon = dummy_movies.filter((movie) => movie.nowPlaying === false);

        console.log(current);
        console.log(comingSoon);

        setCurrentMovies(current);
        setComingSoonMovies(comingSoon);
    }, []);

    return (
        <div>
            <NavBar />
            <SearchBar />

            <div className="my-8">
                <h2 className="text-2xl font-bold m-4">Currently Running Movies</h2>
                <NowPlaying movies={currentMovies} />
            </div>

            <div className="my-8">
                <h2 className="text-2xl font-bold m-4">Coming Soon Movies</h2>
                <ComingSoon movies={comingSoonMovies} />
            </div>
        </div>
    );
};

export default Home;
