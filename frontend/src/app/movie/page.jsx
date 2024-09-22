"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar";

const dummy_movie = {
    id: 1,
    title: "Interstellar",
    category: "Science Fiction / Adventure",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    producer: "Emma Thomas, Christopher Nolan",
    synopsis:
        "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    picture:
        "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    rating: "PG-13",
    nowPlaying: true,
};

export default function Movie() {
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("userRole"); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    const buyTickets = (e) => {
        e.preventDefault();
        router.push("/select-tickets");
    };


    return (
        <div>
            <NavBar userRole={userRole} />

            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <img
                            src={dummy_movie.picture}
                            alt={`${dummy_movie.title} Poster`}
                            className="rounded-lg w-full h-auto max-w-lg object-cover shadow-lg"
                        />
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{dummy_movie.title}</h1>
                            <p className="text-white mb-4">{dummy_movie.synopsis}</p>
                            <p className="text-white mb-2">
                                <strong>Category: </strong>
                                {dummy_movie.category}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Cast: </strong>
                                {dummy_movie.cast.join(", ")}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Director: </strong>
                                {dummy_movie.director}
                            </p>
                            <p className="text-white mb-2">
                                <strong>Producer: </strong>
                                {dummy_movie.producer}
                            </p>
                            <p className="text-white mb-4">
                                <strong>Rating: </strong>
                                {dummy_movie.rating}
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    width="100%"
                                    height="400px"
                                    src={dummy_movie.trailer.replace("watch?v=", "embed/")}
                                    title={`${dummy_movie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                                onClick={buyTickets}
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

