"use client"
import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';

export default function SelectSeats() {
    const [userRole, setUserRole] = useState(null);

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

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    return(
        <div>
            <NavBar userRole={userRole}/>
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
                    <button className='bg-blue-500 p-2 rounded-lg'>Continue</button>
                </div>
                
            </div>
        </div>
    )
}
