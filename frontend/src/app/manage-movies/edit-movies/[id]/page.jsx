"use client";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/contexts/user";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/navBar";
import RestrictedPage from "@/app/components/restrictedPage";
import LoadingPage from "@/app/components/loadingPage";
import axios from "axios";

export default function EditMovies({ params }) {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [cast, setCast] = useState("");
    const [director, setDirector] = useState("");
    const [producer, setProducer] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [trailer, setTrailer] = useState("");
    const [picture, setPicture] = useState("");
    const [rating, setRating] = useState("");
    const [durationInMinutes, setDurationInMinutes] = useState("");
    const [nowPlaying, setNowPlaying] = useState(true);

    const setMovieDetails = (movie) => {
        setTitle(movie.title);
        setCategory(movie.category);
        setDurationInMinutes(movie.durationInMinutes);
        setRating(movie.rating);
        setSynopsis(movie.synopsis);
        setCast(movie.cast.join(", "));
        setDirector(movie.director);
        setProducer(movie.producer);
        setTrailer(movie.trailer);
        setPicture(movie.picture);
        setNowPlaying(movie.nowPlaying);
    };

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`http://localhost:8080/movies/${id}`)
                .then((response) => {
                    console.log(response.data);
                    setMovieDetails(response.data)
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                    setIsLoading(false);
                });
        }
    }, [id]);


    const handleSaveChanges = (e) => {
        e.preventDefault();

        const updatedMovie = {
            title,
            category,
            cast: cast.split(",").map((item) => item.trim()),
            director,
            producer,
            synopsis,
            trailer,
            picture,
            rating,
            nowPlaying,
            durationInMinutes: parseInt(durationInMinutes)
        };

        axios.patch(`http://localhost:8080/movies/${id}`, updatedMovie)
            .then(() => {
                alert("Movie updated successfully!");
                router.push("/manage-movies");
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to update movie. Please try again.");
            });
    };

    const handleBack = () => {
        router.push("/manage-movies");
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />

                <div className="flex flex-col justify-center items-center m-8 p-8">
                    <form className="bg-neutral-800/80 text-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={handleSaveChanges}>
                        <h1 className="text-4xl font-semibold mb-6">Edit Movie</h1>

                        <div className="flex flex-col px-2 mx-2 md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="font-medium mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-medium mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col px-2 mx-2 md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="font-medium mb-1">
                                    Duration (Minutes) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={durationInMinutes}
                                    onChange={(e) => setDurationInMinutes(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-medium mb-1">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-medium mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={nowPlaying}
                                    onChange={(e) => setNowPlaying(e.target.value)}
                                    className="w-full p-[12px] rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                >
                                    <option value="true">Now Playing</option>
                                    <option value="false">Coming Soon</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Synopsis <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={synopsis}
                                onChange={(e) => setSynopsis(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Cast <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={cast}
                                onChange={(e) => setCast(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Director <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Producer <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={producer}
                                onChange={(e) => setProducer(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Trailer URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={trailer}
                                onChange={(e) => setTrailer(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className="mb-4 px-2 mx-2">
                            <label className="font-medium mb-1">
                                Picture URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={picture}
                                onChange={(e) => setPicture(e.target.value)}
                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                required
                            />
                        </div>

                        <div className='flex mx-4 justify-between'>
                            <button
                                type="button"
                                onClick={handleBack}
                                className="font-semibold px-4 py-2 rounded-lg text-white bg-neutral-700/50 hover:bg-neutral-700 transition duration-300 ease-in-out"
                            >
                                Back
                            </button>

                            <button type="submit" className="bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
