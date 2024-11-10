"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NavBar from "@/app/components/navBar";
import LoadingPage from "@/app/components/loadingPage";

export default function Movie({ params }) {
    const router = useRouter();
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`http://localhost:8080/movies/${id}`)
                .then((response) => {
                    setMovie(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                    setIsLoading(false);
                });
        }
    }, [id]);

    const buyTickets = (e) => {
        e.preventDefault();
        if (userType === "CUSTOMER") {
            router.push("/select-tickets");
        } else {
            alert("You must be a customer and log in to book tickets");
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!movie) {
        return (
            <div>
                <NavBar userType={userType} />
                <div className="flex justify-center items-center p-40 m-40">
                    <h1 className="text-center text-4xl font-semibold text-white">
                        Movie Not Found
                    </h1>
                </div>
            </div>
        );
    }

    const uniqueShowtimes = Array.from(new Map(
        movie.shows
            .map(show => {
                const showDate = new Date(show.time);
                const showKey = showDate.toISOString().split("T")[0] + showDate.toTimeString().split(" ")[0];
                return [showKey, show];
            })
            .sort((a, b) => new Date(a[1].time) - new Date(b[1].time))
    ).values());

    return (
        <div>
            <NavBar userType={userType} />

            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-28">
                    <div className="flex justify-center">
                        <img
                            src={movie.picture}
                            alt={`${movie.title} Poster`}
                            className="rounded-lg w-full h-auto max-w-lg object-cover shadow-lg"
                        />
                    </div>

                    <div className="flex flex-col justify-between">
                        <h1 className="text-4xl font-bold">{movie.title}</h1>
                        <div className="border-t border-gray-400/70 mt-4 pt-4">
                            <h2 className="text-2xl font-semibold mb-4">Description</h2>
                            <p className="text-white mb-4">{movie.synopsis}</p>
                            <p className="text-white mb-2">
                                <strong>Category: </strong>
                                {movie.category}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Cast: </strong>
                                {movie.cast.join(", ")}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Director: </strong>
                                {movie.director}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Producer: </strong>
                                {movie.producer}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Duration: </strong>
                                {movie.durationInMinutes} minutes
                            </p>
                            <p className="text-white mb-4">
                                <strong>Rating: </strong>
                                {movie.rating}
                            </p>

                            <div className="border-t border-gray-400/70 mt-4 pt-4 mb-2">
                                <h2 className="text-2xl font-semibold text-white mb-4">Showtimes</h2>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {uniqueShowtimes.length > 0 ? (
                                        uniqueShowtimes.map(show => {
                                            const startTime = new Date(show.time);
                                            const endTime = new Date(startTime.getTime() + movie.durationInMinutes * 60000);
                                            return (
                                                <div key={show.id} className="flex flex-col items-center bg-gray-700 rounded-lg p-3">
                                                    <p className="text-white font-bold">
                                                        {startTime.toLocaleDateString()} | {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-400/70">No showtimes available at the moment</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-400/70 mt-4 pt-4">
                            <div className="aspect-w-16 aspect-h-9">
                                <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                                <iframe
                                    width="100%"
                                    height="400px"
                                    src={movie.trailer.replace("watch?v=", "embed/")}
                                    title={`${movie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className={`px-4 py-2 rounded ${userType === "CUSTOMER"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-gray-300 cursor-not-allowed text-white"
                                    }`}
                                onClick={buyTickets}
                                disabled={userType !== "CUSTOMER"}
                            >
                                Book Tickets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

