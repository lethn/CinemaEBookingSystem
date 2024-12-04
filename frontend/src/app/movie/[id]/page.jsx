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
        router.push(`/select-tickets/${movie.id}`);
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
            .filter(show => new Date(show.time) > new Date()) // Filter to only include upcoming showtimes
            .map(show => {
                const showDate = new Date(show.time);
                const showKey = showDate.toISOString().split("T")[0] + showDate.toTimeString().split(" ")[0];
                return [showKey, show];
            })
            .sort((a, b) => new Date(a[1].time) - new Date(b[1].time))
    ).values());

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar userType={userType} />
            <div className='grid grid-cols-[6fr_7fr_7fr] flex-grow'>
                <div className="flex flex-col h-full p-4">
                    <img
                        src={movie.picture}
                        alt="Poster"
                        className="rounded-lg w-full object-cover h-1 flex-grow"
                    />
                </div>
                <div className="flex flex-col h-full py-4">
                    <div className=" bg-neutral-800/80 rounded-lg mb-4">
                        <div className=" bg-neutral-700 pt-4 px-4 pb-2 rounded-t-lg">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="text-4xl text-white font-bold">{movie.title}</h2>
                                <p className="text-white text-2xl border-2 border-white flex items-center justify-center px-1">{movie.rating}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-white text-xl">{movie.category}</p>
                                <p className="text-white text-xl">{movie.durationInMinutes} mins</p>
                            </div>
                        </div>
                        <div className="px-4 pb-4 pt-2">
                            <p className="text-white mb-2">{movie.synopsis}</p>
                            <p className="text-white mb-2">Cast: {movie.cast.join(', ')}</p>
                            <p className="text-white mb-2">Director: {movie.director}</p>
                            <p className="text-white">Producer: {movie.producer}</p>
                        </div>
                    </div>
                    <div className="flex flex-grow rounded-lg overflow-hidden">
                        <iframe
                            width="100%"
                            height="max-content"
                            src={movie.trailer.replace("watch?v=", "embed/")}
                            title={`${movie.title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
                <div className="flex flex-col h-full p-4">
                    <h2 className="text-4xl font-semibold text-white mb-2">Showtimes:</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {uniqueShowtimes.length > 0 ? (
                            uniqueShowtimes.map(show => {
                                const startTime = new Date(show.time);
                                const endTime = new Date(startTime.getTime() + movie.durationInMinutes * 60000);

                                const formattedDate = startTime.toLocaleString([], {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                });

                                const formattedTime = `${startTime.toLocaleString([], {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })} - ${endTime.toLocaleString([], {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}`;

                                return (
                                    <div key={show.id} className="bg-neutral-800/80 rounded-lg p-3 h-min">
                                        <p className="text-white font-bold text-center">
                                            {formattedDate}
                                        </p>
                                        <p className="text-gray-300 text-center">
                                            {formattedTime}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-3">
                                <p className="text-gray-400/70 text-center">No showtimes available at the moment</p>
                            </div>
                        )}
                    </div>
                    {movie.nowPlaying && (
                        <div className="flex flex-grow items-end mt-4">
                            <button
                                className={`p-3 w-full rounded-lg transition duration-300 ease-in-out hover:bg-green-700 text-white ${userType === "ADMIN" ? " bg-green-700 cursor-not-allowed" : "bg-green-500 "}`}
                                onClick={buyTickets}
                                disabled={userType === "ADMIN"}
                            >
                                Book Tickets
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

