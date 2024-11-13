"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/user';
import axios from 'axios';
import NavBar from "../components/navBar";
import RestrictedPage from '../components/restrictedPage';
import LoadingPage from "../components/loadingPage";

export default function OrderSummary() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [childTickets, setChildTickets] = useState(null);
    const [adultTickets, setAdultTickets] = useState(null);
    const [seniorTickets, setSeniorTickets] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const [movie, setMovie] = useState(null);
    const [showId, setShowId] = useState(null);
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState(null);
    const childTicketPrice = 11.99;
    const adultTicketPrice = 11.99;
    const seniorTicketPrice = 11.99;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const childTicketsParam = queryParams.get('childTickets');
            const adultTicketsParam = queryParams.get('adultTickets');
            const seniorTicketsParam = queryParams.get('seniorTickets');
            const movieIdParam = queryParams.get('movieId');
            const showIdParam = queryParams.get('id');
            const selectedSeatsParam = queryParams.get('selectedSeats');
            if (selectedSeatsParam) {
                setChildTickets(childTicketsParam);
                setAdultTickets(adultTicketsParam);
                setSeniorTickets(seniorTicketsParam);
                setMovieId(movieIdParam);
                setShowId(showIdParam);
                setSelectedSeats(selectedSeatsParam);
            }
        }
    }, []);

    useEffect(() => {
        if (movieId) {
            setIsLoading(true);
            axios.get(`http://localhost:8080/movies/${movieId}`)
                .then((response) => {
                    setMovie(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                });
        }
        if (showId) {
            axios.get(`http://localhost:8080/shows/${showId}`)
                .then((response) => {
                    setShow(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching show data:", error);
                    setIsLoading(false);
                });
        }
    }, [movieId, showId]);

    if (isLoading) {
        return(
            <LoadingPage />
        )
    }

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div className="flex flex-col min-h-screen">
                <NavBar userType={userType} />
                <div className="grid grid-cols-3 p-4 flex-grow">
                    <div className="flex flex-col bg-neutral-800/80 mr-4 rounded-xl h-full">
                        <img 
                            src={movie?.picture} 
                            alt="Poster" 
                            className="rounded-t-xl w-full object-cover h-1 items-top object-top flex-grow" 
                        />
                        <div className="p-4 h-1/4">
                            <div className="flex w-full justify-between">
                                <h2 className="text-2xl text-white font-bold">{movie?.title}</h2>
                                <p className="text-white border-2 border-white flex items-center justify-center px-1">{movie?.rating}</p>
                            </div>
                            <h2 className="text-xl text-white font-bold">
                                {new Date(show.time).toLocaleString([], {
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                })}
                            </h2>
                            <p className="text-lg">Seats: {selectedSeats}</p>
                        </div>
                    </div>
                    <div className="">
                        <h2 className="text-4xl font-semibold w-full">Payment Information</h2>
                        <div className="flex justify-center">
                            <form onSubmit={seniorTicketPrice} className="my-4">
                                <input
                                    type="text"
                                    placeholder="Discount Code"
                                    className="rounded-lg p-3 bg-neutral-800/80 text-white text-center"
                                />
                                <button type='submit' className="ml-1 p-3 bg-red-600 text-white rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Apply
                                </button>
                            </form>
                        </div>
                        <div className="grid grid-cols-[3fr_4fr_2fr] text-lg">
                            <p className="text-right my-1">Child Tickets:</p>
                            <p className="text-center my-1">x{childTickets}</p>
                            <p className="my-1">${childTicketPrice*childTickets}</p>
                            <p className="text-right my-1">Adult Tickets:</p>
                            <p className="text-center my-1">x{adultTickets}</p>
                            <p className="my-1">${adultTicketPrice*adultTickets}</p>
                            <p className="text-right my-1">Senior Tickets:</p>
                            <p className="text-center my-1">x{seniorTickets}</p>
                            <p className="my-1">${seniorTicketPrice*seniorTickets}</p>
                            <p className="text-right border-t py-1">Total:</p>
                            <p className="text-center border-t py-1"></p>
                            <p className="border-t py-1">${seniorTicketPrice*seniorTickets + adultTicketPrice*adultTickets + childTicketPrice*childTickets}</p>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}