"use client";
import NavBar from "./components/navBar";
import ComingSoon from "./components/comingSoon";
import NowPlaying from "./components/nowPlaying";
import SearchBar from "./components/searchBar";
import { useState, useEffect } from "react";

const movies = [
    {
        id: 1,
        title: "The Galactic Odyssey",
        category: "Science Fiction",
        cast: ["Chris Hemsworth", "Natalie Portman", "Mark Ruffalo"],
        director: "James Cameron",
        producer: "Kathleen Kennedy",
        synopsis: "A thrilling adventure through the galaxy, where heroes must unite to battle an ancient alien threat.",
        trailer: "https://youtube.com/trailer/galacticodyssey",
        picture: "https://placehold.co/500x750",
        rating: "PG-13",
        nowPlaying: true
    },
    {
        id: 2,
        title: "Lost in the Woods",
        category: "Thriller",
        cast: ["Emily Blunt", "Jake Gyllenhaal", "Jessica Chastain"],
        director: "David Fincher",
        producer: "Ridley Scott",
        synopsis: "A group of hikers faces their worst nightmares after getting lost in a mysterious forest.",
        trailer: "https://youtube.com/trailer/lostinthewoods",
        picture: "https://placehold.co/500x750",
        rating: "R",
        nowPlaying: false
    },
    {
        id: 3,
        title: "Love at Sunset",
        category: "Romantic Comedy",
        cast: ["Ryan Gosling", "Emma Stone", "Anne Hathaway"],
        director: "Nancy Meyers",
        producer: "J.J. Abrams",
        synopsis: "Two strangers meet at a tropical resort and find love when they least expect it.",
        trailer: "https://youtube.com/trailer/loveatsunset",
        picture: "https://placehold.co/500x750",
        rating: "PG",
        nowPlaying: true
    },
    {
        id: 4,
        title: "The Silent Struggle",
        category: "Drama",
        cast: ["Viola Davis", "Denzel Washington", "Octavia Spencer"],
        director: "Ava DuVernay",
        producer: "Tyler Perry",
        synopsis: "A heartfelt story of a family's battle against poverty and their journey towards hope and survival.",
        trailer: "https://youtube.com/trailer/thesilentstruggle",
        picture: "https://placehold.co/500x750",
        rating: "PG-13",
        nowPlaying: false
    },
    {
        id: 5,
        title: "Code of Shadows",
        category: "Action",
        cast: ["Keanu Reeves", "Charlize Theron", "Idris Elba"],
        director: "Chad Stahelski",
        producer: "Christopher Nolan",
        synopsis: "A rogue assassin must confront his past when he is targeted by a global crime syndicate.",
        trailer: "https://youtube.com/trailer/codeofshadows",
        picture: "https://placehold.co/500x750",
        rating: "R",
        nowPlaying: true
    }
];


const Home = () => {
    const [currentMovies, setCurrentMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);

    useEffect(() => {
        // Filter the movies, if nowPlaying = true => current movies
        //                       nowPlaying = false => comming soon movies
        const current = movies.filter((movie) => movie.nowPlaying === true);
        const comingSoon = movies.filter((movie) => movie.nowPlaying === false);

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
