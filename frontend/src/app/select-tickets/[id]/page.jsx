"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../contexts/user';
import axios from 'axios';
import NavBar from "@/app/components/navBar";
import RestrictedPage from '../../components/restrictedPage';
import LoadingPage from "@/app/components/loadingPage";

export default function SelectSeats({ params }) {
    const { isLoggedIn } = useContext(AuthContext);
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

    if (isLoading) {
        return(
            <LoadingPage />
        )
    }

    if (!movie) {
        return (
            <RestrictedPage heading1="Movie Not Found" />
        );
    }

    const sortedShows = movie.shows.sort((a, b) => new Date(a.time) - new Date(b.time));

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar userType={userType} />
            <div className='grid grid-cols-[2fr_5fr] p-4 flex-grow'>
                <div className='flex items-center flex-col bg-neutral-800/80 p-4 rounded-xl h-full'>
                    <div className="flex w-full justify-between items-center">
                        <h2 className="text-2xl text-white font-bold">{movie.title}</h2>
                        <p className="text-white border-2 border-white flex items-center justify-center px-1">{movie.rating}</p>
                    </div>
                    <div className="flex w-full justify-between text-lg mb-2">
                        <h3>{movie.category}</h3>
                        <h3>{movie.durationInMinutes} mins</h3>
                    </div>
                    <div className="w-full aspect-square flex justify-center items-center border rounded-lg border-white">
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
                            className="w-full h-[67%]"
                            ></iframe>
                        )}
                    </div>
                    <div className="">
                        <button className="mx-1 text-xl text-white" onClick={poster}>◁</button>
                        <button className="mx-1 text-xl text-white" onClick={poster}>▷</button>
                    </div>
                    <div className="w-full">
                        <p>Director: {movie.director}</p>
                        <p>Cast: {movie.cast.join(", ")}</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className='grid grid-cols-[2fr_3fr]'>
                        <div className='px-4 flex items-center flex-col'>
                            <h2 className="text-4xl font-semibold mb-6 w-full pl-4">Tickets</h2>
                            <div className="grid grid-cols-2 grid-rows-3 gap-4">
                                    <label className="text-xl m-2 text-right">Child (0-12):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={childTickets}
                                        onChange={(e) => handleTicketChange(e, 'child')}
                                        className="rounded-lg p-2 bg-neutral-800/80 text-white text-center w-[75%] outline-1 outline-navBarRed focus:outline focus:bg-neutral-700/50 hover:bg-neutral-700/50"
                                    />
                                    <label className="text-xl m-2 text-right">Adult (13-64):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={adultTickets}
                                        onChange={(e) => handleTicketChange(e, 'adult')}
                                        className="rounded-lg p-2 bg-neutral-800/80 text-white text-center w-[75%] outline-1 outline-navBarRed focus:outline focus:bg-neutral-700/50 hover:bg-neutral-700/50"
                                    />
                                    <label className="text-xl m-2 text-right">Senior (65+):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={seniorTickets}
                                        onChange={(e) => handleTicketChange(e, 'senior')}
                                        className="rounded-lg p-2 bg-neutral-800/80 text-white text-center w-[75%] outline-1 outline-navBarRed focus:outline focus:bg-neutral-700/50 hover:bg-neutral-700/50"
                                    />
                            </div>
                        </div>
                        <div className="flex items-center flex-col">
                            <h2 className="text-4xl font-semibold mb-6 w-full pl-4">Showtimes</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {sortedShows.filter((show) => new Date(show.time) > new Date()).map((show) => {
                                    const availableSeats = show.allSeats.length - show.reservedSeats.length;
                                    const isUnavailable = totalTickets > availableSeats;
                                    return (
                                        <button 
                                            key={show.id} 
                                            className={`px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out ${!isUnavailable && !(selectedShowtime === show.id) ? 'hover:bg-red-900' : ''} ${selectedShowtime === show.id ? 'bg-navBarRed' : 'bg-neutral-800/80'} ${isUnavailable ? 'cursor-not-allowed line-through' : ''}`}
                                            onClick={() => handleShowtimeSelect(show.id)}
                                            disabled={isUnavailable}
                                        >   
                                            <div className="text-center">
                                                <p className="text-white font-bold text-center">
                                                    {new Date(show.time).toLocaleString([], {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-gray-300 text-center">
                                                    {new Date(show.time).toLocaleString([], {
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })} - {new Date(new Date(show.time).getTime() + movie.durationInMinutes * 60000).toLocaleString([], {
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-between pl-4 mt-auto">
                        <button onClick={handleCancel} className="text-lg bg-neutral-800/80 text-white p-3 rounded-lg hover:bg-neutral-700 transition duration-300 ease-in-out">
                            Back Home
                        </button>
                        {selectedShowtime ? (
                            <button onClick={handleSubmit} className="text-lg bg-navBarRed text-white p-3 rounded-lg hover:bg-red-900 transition duration-300 ease-in-out">
                                Select Seats
                            </button>
                        ) : (
                            <button className="text-lg bg-red-900 text-white p-3 rounded-lg transition duration-300 ease-in-out" disabled>
                                Select Seats
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
