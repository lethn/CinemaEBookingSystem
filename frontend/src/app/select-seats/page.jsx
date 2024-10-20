"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';

export default function SelectSeats() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const router = useRouter();
    const [selectedSeats, setSelectedSeats] = useState([]);

    const rows = 'ABCDEFGH'.split('');
    const columns = Array.from({ length: 16 }, (_, i) => i + 1);

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleSubmit = (e) => {
        router.push('/order-summary')
    }

    const handleCancel = (e) => {
        router.push('/');
    };

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div>
                <NavBar userType={userType} />
                <div className='p-4'>
                    <h1 className="text-2xl font-bold mb-4">Select Your Seats</h1>
                    <div className='p-4 flex justify-center'>
                        <h2 className='bg-white text-black p-3 px-20 rounded-lg'>SCREEN</h2>
                    </div>

                    <div className="space-y-2">
                        {rows.map((row) => (
                            <div key={row} className="flex space-x-2 justify-center">
                                {columns.map((col) => {
                                    const seat = `${row}${col}`;
                                    return (
                                        <button
                                            key={seat}
                                            className={`w-10 h-10 text-sm rounded ${selectedSeats.includes(seat) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} hover:bg-gray-400`}
                                            onClick={() => toggleSeatSelection(seat)}
                                        >
                                            {seat}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Selected Seats:</h2>
                            <p className="text-lg">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}</p>
                        </div>
                        <div>
                            <button onClick={handleSubmit} className='bg-blue-500 p-2 rounded-lg'>Continue</button>
                            <button onClick={handleCancel} className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg">
                                Cancel
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
