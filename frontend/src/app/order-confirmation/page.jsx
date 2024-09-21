"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar";

export default function OrderConfirmation() {
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    const [bookingDetails, setBookingDetails] = useState({
        confirmationNumber: '123456789',
        movieTitle: 'The Amazing Movie',
        dateTime: 'September 21, 2024 - 7:30 PM',
        seat: 'Row A, Seat 10',
        totalCost: '$25.00',
        email: 'example@gmail.com'
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/");
    };

    return (
        <div>
            <NavBar userRole={userRole} />
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
                        className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700">
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}
