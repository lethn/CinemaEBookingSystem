"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../contexts/user';
import axios from 'axios';
import NavBar from '../../components/navBar';
import RestrictedPage from '../../components/restrictedPage';
import LoadingPage from '@/app/components/loadingPage';

export default function SelectSeats({ params }) {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [sortedSeats, setSortedSeats] = useState([]);
    const [childTickets, setChildTickets] = useState(null);
    const [adultTickets, setAdultTickets] = useState(null);
    const [seniorTickets, setSeniorTickets] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const totalCols = 25; // Columns from 1 to 25
    const totalRows = 12;

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryString = new URLSearchParams({
            sortedSeats,
            id,
            movieId,
            childTickets,
            adultTickets,
            seniorTickets
        }).toString();

        router.push(`/order-summary?${queryString}`);
    }

    const handleCancel = (e) => {
        router.push(`/select-tickets/${movieId}`)
    };

    const handleSeatSelect = (seatLabel) => {
        setSelectedSeats(prevSelectedSeats => {
            if (prevSelectedSeats.includes(seatLabel)) {
                return prevSelectedSeats.filter(seat => seat !== seatLabel);
            } else if (prevSelectedSeats.length < totalTickets) {
                return [...prevSelectedSeats, seatLabel];
            } else {
                return [...prevSelectedSeats.slice(1), seatLabel];
            }
        });
    }

    useEffect(() => {
        setSortedSeats([...selectedSeats].sort());
    }, [selectedSeats]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/shows/${id}`)
                .then((response) => {
                    setShowtime(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                    setIsLoading(false);
                }
            );
        }
    }, [id]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const childTicketsParam = queryParams.get('childTickets');
            const adultTicketsParam = queryParams.get('adultTickets');
            const seniorTicketsParam = queryParams.get('seniorTickets');
            if (childTicketsParam && adultTicketsParam && seniorTicketsParam) {
                setTotalTickets(Number(childTicketsParam) + Number(adultTicketsParam) + Number(seniorTicketsParam));
                setChildTickets(childTicketsParam);
                setAdultTickets(adultTicketsParam);
                setSeniorTickets(seniorTicketsParam);
            }
            const movieIdParam = queryParams.get('movieId');
            if (movieIdParam) {
                setMovieId(Number(movieIdParam))
            }
        }
    }, []);

    if (isLoading) {
        return(
            <LoadingPage />
        )
    }

    if (!showtime) {
        return (
            <RestrictedPage heading1="Show Not Found" />
        );
    }

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar userType={userType} />
                <div className='flex flex-col items-center p-4'>
                    <h2 className="text-4xl font-semibold mb-2 w-full">Select Seats</h2>
                    <div className="mx-auto w-[50%] h-[50px] bg-gradient flex items-end justify-center text-lg p-2">
                        SCREEN
                    </div>
                    <div className='grid grid-cols-[repeat(25,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))] mt-4'>
                        {Array.from({ length: totalRows * totalCols }).map((_, index) => {
                            const row = Math.floor(index / totalCols);
                            const col = index % totalCols;
                            const seatLabel = String.fromCharCode(65 + row) + (col + 1);

                            return (
                                <div key={seatLabel} className="seat">
                                    {showtime.allSeats.includes(seatLabel) ? (
                                        showtime.reservedSeats.includes(seatLabel) ? (
                                            <button
                                                className="w-[30px] text-neutral-800/80 cursor-not-allowed"
                                                disabled
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.000000 96.000000" fill="currentColor">
                                                    <g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                                                        <path d="M360 827 c-66 -15 -96 -31 -110 -57 -6 -11 -10 -94 -10 -194 l0 -175 26 -20 c95 -75 333 -75 428 0 l26 20 0 180 c0 176 -1 180 -24 204 -13 13 -41 28 -62 35 -61 17 -212 21 -274 7z"/>
                                                        <path d="M91 746 c-8 -9 -11 -89 -9 -271 3 -233 5 -259 21 -269 12 -8 22 -8 35 0 15 10 17 36 20 269 2 182 -1 262 -9 271 -15 18 -43 18 -58 0z"/>
                                                        <path d="M811 746 c-8 -9 -11 -89 -9 -271 3 -233 5 -259 21 -269 12 -8 22 -8 35 0 15 10 17 36 20 269 2 182 -1 262 -9 271 -15 18 -43 18 -58 0z"/>
                                                        <path d="M247 283 c-4 -3 -7 -31 -7 -60 0 -44 5 -58 25 -78 24 -25 26 -25 215 -25 189 0 191 0 215 25 21 20 25 34 25 79 0 30 -5 58 -10 61 -6 4 -36 -4 -68 -16 -81 -32 -242 -33 -322 -1 -61 24 -64 25 -73 15z"/>
                                                    </g>
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                className={`w-[30px] ${selectedSeats.includes(seatLabel) ? 'text-navBarRed' : 'hover:text-red-900'} transition duration-300 ease-in-out`}
                                                onClick={() => handleSeatSelect(seatLabel)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.000000 96.000000" fill="currentColor">
                                                    <g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                                                        <path d="M360 827 c-66 -15 -96 -31 -110 -57 -6 -11 -10 -94 -10 -194 l0 -175 26 -20 c95 -75 333 -75 428 0 l26 20 0 180 c0 176 -1 180 -24 204 -13 13 -41 28 -62 35 -61 17 -212 21 -274 7z"/>
                                                        <path d="M91 746 c-8 -9 -11 -89 -9 -271 3 -233 5 -259 21 -269 12 -8 22 -8 35 0 15 10 17 36 20 269 2 182 -1 262 -9 271 -15 18 -43 18 -58 0z"/>
                                                        <path d="M811 746 c-8 -9 -11 -89 -9 -271 3 -233 5 -259 21 -269 12 -8 22 -8 35 0 15 10 17 36 20 269 2 182 -1 262 -9 271 -15 18 -43 18 -58 0z"/>
                                                        <path d="M247 283 c-4 -3 -7 -31 -7 -60 0 -44 5 -58 25 -78 24 -25 26 -25 215 -25 189 0 191 0 215 25 21 20 25 34 25 79 0 30 -5 58 -10 61 -6 4 -36 -4 -68 -16 -81 -32 -242 -33 -322 -1 -61 24 -64 25 -73 15z"/>
                                                    </g>
                                                </svg>
                                            </button>
                                        )
                                    ) : (
                                        <div className="w-full"></div> // Empty cell if seat is not in allSeats
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex w-full justify-between items-center px-4 pb-4 mt-auto">
                    <button onClick={handleCancel} className="text-lg bg-neutral-800/80 text-white p-3 rounded-lg hover:bg-red-900 transition duration-300 ease-in-out">
                        Go Back
                    </button>
                    <div className="">
                        {selectedSeats.length > 0 && (
                            <span className="text-white">Seats selected: </span>
                        )}
                        {sortedSeats.sort().map((seat, index) => (
                            <span key={index} className="text-white">
                                {seat}
                                {index < selectedSeats.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                    {selectedSeats.length === totalTickets ? (
                        <button onClick={handleSubmit} className="text-lg bg-navBarRed text-white p-3 rounded-lg hover:bg-red-900 transition duration-300 ease-in-out">
                            Checkout
                        </button>
                    ) : (
                        <button className="text-lg bg-red-900 text-white p-3 rounded-lg transition duration-300 ease-in-out" disabled>
                            Checkout
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}