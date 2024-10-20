"use client"
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/user';
import NavBar from "../components/navBar";
import RestrictedPage from '../components/restrictedPage';

export default function OrderConfirmation() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const router = useRouter();

    const [bookingDetails, setBookingDetails] = useState({
        confirmationNumber: '123456789',
        movieTitle: 'The Amazing Movie',
        dateTime: 'September 21, 2024 - 7:30 PM',
        seat: 'Row A, Seat 10',
        totalCost: '$25.00',
        email: 'example@gmail.com'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/");
    };

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div>
                <NavBar userType={userType} />
                <div className="flex justify-center m-12 p-12">
                    <div className="bg-white p-12 m-auto shadow-lg rounded-lg">
                        <p className="text-center text-black font-bold text-3xl">Thank you for your booking!</p>
                        <p className="text-center text-black mt-2 text-lg">Booking Confirmation Number: <strong>{bookingDetails.confirmationNumber}</strong></p>
                        <p className="text-center text-black mt-2 text-lg">Movie Title: <strong>{bookingDetails.movieTitle}</strong></p>
                        <p className="text-center text-black mt-2 text-lg">Date/Time: <strong>{bookingDetails.dateTime}</strong></p>
                        <p className="text-center text-black mt-2 text-lg">Seat: <strong>{bookingDetails.seat}</strong></p>
                        <p className="text-center text-black mt-2 text-lg">Total Cost: <strong>{bookingDetails.totalCost}</strong></p>
                        <p className="text-center text-black mt-2 text-lg">A copy of your ticket has been sent to <strong>{bookingDetails.email}</strong></p>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-red-600 text-white p-3 mt-6 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                            Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}