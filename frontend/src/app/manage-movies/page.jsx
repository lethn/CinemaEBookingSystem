"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../contexts/user";
import NavBar from "../components/navBar";
import Pagination from "../components/Pagination";
import RestrictedPage from "../components/restrictedPage";
import axios from "axios";

export default function ManageMovies() {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);

    // List of Movies Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 5;
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(movies.length / moviesPerPage);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/movies");
            setMovies(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleAddMovie = () => {
        router.push("manage-movies/add-movies");
    };

    const handleCreateTheatre = () => {
        router.push("manage-movies/add-theatres-showrooms");
    };

    const handleEditMovie = (movieId) => {
        router.push(`manage-movies/edit-movies/${movieId}`);
    };

    const handleEditShowtimes = (movieId) => {
        router.push(`manage-movies/manage-showtimes/${movieId}`);
    };

    const changePageHandler = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDeleteMovie = async (movieId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
        if (!confirmDelete)
            return;

        try {
            await axios.delete(`http://localhost:8080/movies/${movieId}`);
            const updatedMovies = movies.filter((movie) => movie.id !== movieId);
            setMovies(updatedMovies);

            if (updatedMovies.length > 0 && indexOfFirstMovie >= updatedMovies.length && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            alert("Failed to delete the movie. Please try again later.");
        }
    };

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />
                <h1 className="text-3xl font-semibold text-white text-center m-2 p-2">Manage Movies</h1>

                <div className="flex gap-4 m-2 p-2 justify-center">
                    <button
                        onClick={handleAddMovie}
                        className="font-semibold px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-800 transition duration-300 ease-in-out"
                    >
                        Add Movie
                    </button>
                    <button
                        onClick={handleCreateTheatre}
                        className="font-semibold px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-800 transition duration-300 ease-in-out"
                    >
                        Manage Theatre and Showroom
                    </button>
                </div>

                <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                    <h2 className="text-3xl font-semibold text-white mb-4 text-center">List of Movies</h2>

                    <div className="grid grid-cols-6 justify-center items-center gap-2 px-3 py-1 bg-neutral-700 border-gray-500 text-white rounded-lg font-semibold hidden md:grid mb-4">
                        <p className="p-3 text-lg text-center">Title</p>
                        <p className="p-3 text-lg text-center">Genre</p>
                        <p className="p-3 text-lg text-center">Rating</p>
                        <p className="p-3 text-lg text-center">Edit Details</p>
                        <p className="p-3 text-lg text-center">Edit Showtimes</p>
                        <p className="p-3 text-lg text-center">Delete</p>
                    </div>

                    {isLoading ? (
                        <p className="text-center mt-6 text-gray-400/70">Loading movies...</p>
                    ) : (
                        <div className="grid gap-4">
                            {currentMovies.length > 0 ? (
                                currentMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="grid items-center justify-center grid-cols-1 md:grid-cols-6 gap-2 p-3 border-gray-500 text-white bg-neutral-700/50 rounded-lg hover:bg-neutral-700"
                                    >
                                        <div className="font-bold text-lg text-center">{movie.title}</div>
                                        <div className="text-center">{movie.category}</div>
                                        <div className="text-center">{movie.rating}</div>
                                        <div className="text-center">
                                            <button
                                                onClick={() => handleEditMovie(movie.id)}
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-800 w-full md:w-auto transition duration-300 ease-in-out"
                                            >
                                                Edit Details
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                onClick={() => handleEditShowtimes(movie.id)}
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-800 w-full md:w-auto transition duration-300 ease-in-out"
                                            >
                                                Manage Showtimes
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                onClick={() => handleDeleteMovie(movie.id)}
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-6 text-gray-400/70">No movies available at the moment</p>
                            )}
                        </div>
                    )}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChangePage={changePageHandler}
                    pagesPerRow={15}
                />
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
