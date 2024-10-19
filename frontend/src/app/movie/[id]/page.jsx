"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NavBar from "@/app/components/navBar";

export default function Movie({ params }) {
    const router = useRouter();
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/movies/${id}`)
                .then((response) => {
                    setMovie(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                    setLoading(false);
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

    if (loading) {
        return <strong>Loading...</strong>;
    }

    if (!movie) {
        return <strong>Movie Not Found</strong>;
    }

    return (
        <div>
            <NavBar userType={userType} />

            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <img
                            src={movie.picture}
                            alt={`${movie.title} Poster`}
                            className="rounded-lg w-full h-auto max-w-lg object-cover shadow-lg"
                        />
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
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
                            <p className="text-white mb-4">
                                <strong>Rating: </strong>
                                {movie.rating}
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="aspect-w-16 aspect-h-9">
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
