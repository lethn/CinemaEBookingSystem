"use client"
import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';

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

export default function ManageMovies() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [cast, setCast] = useState([]);
    const [director, setDirector] = useState('');
    const [producer, setProducer] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [trailer, setTrailer] = useState('');
    const [picture, setPicture] = useState('');
    const [rating, setRating] = useState('');

    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/movies');
            setMovies(response.data);
            console.log(response.data);
            console.log(isLoggedIn);
            console.log(userID);
            console.log(userType);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        setMovies(dummy_movies);
        //fetchMovies();
    }, []);

    /*
    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);
    */

    const handleDeleteMovie = (id) => {
        setMovies(movies.filter((movie) => movie.id !== id));

        // API call to remove movie from DB
    };

    const handleAddMovie = (e) => {
        alert('impliment later');
        // API POST call to add movie to DB
      };

    return (
        <div>
            <NavBar userType={userType} />
            <h1 className="text-2xl font-bold mb-4 ml-4">Manage Movies</h1>

            <form onSubmit={handleAddMovie} className="ml-4">
                <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Cast"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Director"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Producer"
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Synopsis"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Picture"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <input
                type="text"
                placeholder="Trailer"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
                className="border rounded p-2 mr-2 text-black"
                required
                />
                <select className="text-black mr-2" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Add Movie
                </button>
            </form>


            <table className="min-w-full border m-4 text-xs">
                <thead>
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Cateogry</th>
                        <th className="border p-2">Cast</th>
                        <th className="border p-2">Director</th>
                        <th className="border p-2">Producer</th>
                        <th className="border p-2">Synopsis</th>
                        <th className="border p-2">Picture</th>
                        <th className="border p-2">Trailer</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                {movies.map((movie) => (
                    <tr key={movie.id}>
                    <td className="border p-2">{movie.id}</td>
                    <td className="border p-2">{movie.title}</td>
                    <td className="border p-2">{movie.category}</td>
                    <td className="border p-2">{movie.cast.join(", ")}</td>
                    <td className="border p-2">{movie.director}</td>
                    <td className="border p-2">{movie.producer}</td>
                    <td className="border p-2">{movie.synopsis}</td>
                    <td className="border p-2">{movie.picture}</td>
                    <td className="border p-2">{movie.trailer}</td>
                    <td className="border p-2">{movie.rating}</td>
                    <td className="border p-2">
                        <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="bg-red-500 text-white p-1 rounded"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        
    );
}
