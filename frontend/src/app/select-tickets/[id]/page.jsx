"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NavBar from "@/app/components/navBar";

export default function SelectSeats({ params }) {
    const router = useRouter();
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShowtime, setSelectedShowtime] = useState('');
    const [childTickets, setChildTickets] = useState(0);
    const [adultTickets, setAdultTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [showImage, setShowImage] = useState(true);
    const movieId = id;
    const totalTickets = childTickets + adultTickets + seniorTickets;

    const handleShowtimeSelect = (showtime) => {
        if (totalTickets != 0) {
            setSelectedShowtime(showtime);
        } else {
            alert("Select at least one ticket.")
        }
    };

    const handleTicketChange = (e, ticketType) => {
        const value = parseInt(e.target.value, 10) || 0; // Ensure value is a number or default to 0
        if (ticketType === 'child') {
          setChildTickets(value);
        } else if (ticketType === 'adult') {
          setAdultTickets(value);
        } else if (ticketType === 'senior') {
          setSeniorTickets(value);
        }
        
        setSelectedShowtime('');
    };
    
    const poster = () => {
        setShowImage(!showImage);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams({
            movieId,
            childTickets,
            adultTickets,
            seniorTickets
        }).toString();

        router.push(`/select-seats/${selectedShowtime}?${queryString}`);
    };

    const handleCancel = (e) => {
        router.push('/');
    };

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

    const sortedShows = movie.shows.sort((a, b) => new Date(a.time) - new Date(b.time));

    /** const groupedByDate = Object.values(
        sortedShows.reduce((acc, movie) => {
            const date = movie.time.toLocaleString().split("T")[0]; // Extract the date part
            if (!acc[date]) acc[date] = []; // Initialize array if not present
            acc[date].push(movie); // Add timestamp to corresponding date
            return acc;
        }, {})
    ); */

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar userType={userType} />
            <div className='grid grid-cols-[2fr_2fr_3fr]'>
                <div className='m-4 flex items-center flex-col bg-neutral-800/80 p-4 rounded-xl border-4 border-navBarRed'>
                    <div className="w-full aspect-square flex justify-center border border-4 border-navBarRed rounded-lg">
                        {showImage ? (
                            <img
                            src={movie.picture}
                            alt="Poster"
                            className="max-h-full"
                            />
                        ) : (
                            <iframe
                            src={movie.trailer.replace("watch?v=", "embed/")}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full"
                            ></iframe>
                        )}
                    </div>
                    <div className="mb-1">
                        <button className="mx-1 text-xl text-navBarRed" onClick={poster}>◁</button>
                        <button className="mx-1 text-xl text-navBarRed" onClick={poster}>▷</button>
                    </div>
                    <div className="border-2 border-navBarRed w-full mb-2"></div>
                    <div className="flex w-full justify-between items-center px-1">
                        <h2 className="text-2xl text-white font-bold">{movie.title}</h2>
                        <p className="text-white border-2 border-white flex items-center justify-center px-1">{movie.rating}</p>
                    </div>
                    <div className="border-2 border-navBarRed w-full my-2"></div>
                    <div className="w-full text-left px-1">
                        <p>Genre: {movie.category}</p>
                        <p>Runtime: {movie.durationInMinutes} mins</p>
                    </div>
                </div>
                <div className='m-4 flex items-center flex-col'>
                    <div className="w-full">
                        <h2 className="text-4xl font-semibold mb-6 w-full">Tickets</h2>
                    </div>
                    <div className="w-[75%] grid grid-cols-2 grid-rows-3 gap-4">
                            <label className="text-xl m-2 text-right">Child (0-12):</label>
                            <input
                                type="number"
                                min="0"
                                value={childTickets}
                                onChange={(e) => handleTicketChange(e, 'child')}
                                className="rounded-lg p-2 bg-neutral-800/80 text-white text-center"
                            />
                            <label className="text-xl m-2 text-right">Adult (13-64):</label>
                            <input
                                type="number"
                                min="0"
                                value={adultTickets}
                                onChange={(e) => handleTicketChange(e, 'adult')}
                                className="rounded-lg p-2 bg-neutral-800/80 text-white text-center"
                            />
                            <label className="text-xl m-2 text-right">Senior (65+):</label>
                            <input
                                type="number"
                                min="0"
                                value={seniorTickets}
                                onChange={(e) => handleTicketChange(e, 'senior')}
                                className="rounded-lg p-2 bg-neutral-800/80 text-white text-center"
                            />
                    </div>
                </div>
                <div className="m-4 flex items-center flex-col">
                    <div className="w-full">
                        <h2 className="text-4xl font-semibold mb-6 w-full">Showtimes</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {sortedShows.map((show) => {
                            const availableSeats = show.allSeats.length - show.reservedSeats.length;
                            const isUnavailable = totalTickets > availableSeats;
                            return (
                                <button 
                                key={show.id} 
                                className={`px-4 py-2 rounded text-white ${!isUnavailable && !(selectedShowtime === show.id) ? 'hover:bg-red-900 transition duration-300 ease-in-out' : ''} ${selectedShowtime === show.id ? 'bg-navBarRed' : 'bg-neutral-800/80'} ${isUnavailable ? 'cursor-not-allowed line-through' : ''}`}
                                onClick={() => handleShowtimeSelect(show.id)}
                                disabled={isUnavailable}
                            >{new Date(show.time).toLocaleString([], {
                                weekday: 'short', 
                                month: 'short', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit'
                            })}</button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between px-4 pb-4 mt-auto">
                <button onClick={handleCancel} className="text-lg bg-neutral-800/80 text-white p-3 rounded-lg hover:bg-red-900 transition duration-300 ease-in-out">
                    Cancel
                </button>
                {selectedShowtime && (
                    <button onClick={handleSubmit} className="text-lg bg-navBarRed text-white p-3 rounded-lg hover:bg-red-900 transition duration-300 ease-in-out">
                        Continue
                    </button>
                )}
            </div>
        </div>
    )
}