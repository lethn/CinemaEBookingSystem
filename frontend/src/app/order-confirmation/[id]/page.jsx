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
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/bookings/${id}`)
                .then((response) => {
                    setBooking(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                    setIsLoading(false);
                }
            );
        }
    }, [id]);

    const goHome = (e) => {
        router.push('/');
    };

    if (isLoading) {
        return(
            <LoadingPage />
        )
    }

    if (!booking) {
        return (
            <RestrictedPage heading1="Show Not Found" />
        );
    }

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar userType={userType} />
                <div className='flex flex-col flex-grow items-center p-4'>
                    <div className='flex flex-col flex-grow justify-center items-center w-full'>
                        <div className="flex flex-col bg-neutral-800/80 p-8 rounded-lg w-1/3">
                            <p className="font-bold text-3xl">Thank you for your booking!</p>
                            <p className='text-xl font-bold mt-2'>{booking.movieTitle}</p>
                            <p className='text-xl font-bold'>
                                {new Date(booking.showTime).toLocaleString([], {
                                    weekday: 'long', 
                                    month: 'short', 
                                    day: '2-digit', 
                                    hour: "numeric", 
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="mt-1 text-lg w-full">
                                Seats: {booking.tickets.map((ticket) => ticket.seatId).join(", ")}
                            </p>
                            <p className="my-1 text-lg w-full">Total: ${booking.totalCost.toFixed(2)}</p>
                            <p className="mt-1 text-lg text-center">A copy of your ticket has been sent to your email.</p>
                            <p className="text-sm text-center">Booking ID: {booking.id}</p>
                            <button
                                type="submit"
                                onClick={goHome}
                                className="w-full bg-navBarRed text-white p-3 mt-4 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}