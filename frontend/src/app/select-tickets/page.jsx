"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar';

export default function SelectTickets() {
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const router = useRouter();
    const [selectedShowtime, setSelectedShowtime] = useState('');
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [ages, setAges] = useState([]);

    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
        setAges(new Array(numberOfSeats).fill('')); // Reset ages when showtime is selected
      };

    const handleSeatChange = (e) => {
        const value = e.target.value;
        setNumberOfSeats(value);
        setAges(new Array(value).fill('')); // Adjust ages array size
    };

    const handleAgeChange = (index, value) => {
        const newAges = [...ages];
        newAges[index] = value;
        setAges(newAges);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push('/select-seats');
    };

    const handleCancel = (e) => {
        router.push('/');
    };

    const movieSchedule = {
        'Mon 9/23' : ['2:45 pm', '5:00 pm', '7:30 pm'],
        'Tue 9/24' : ['1:45 pm', '4:00 pm', '6:30 pm'],
        'Wed 9/25' : ['2:00 pm', '4:30 pm', '6:00 pm']
    };

    const dummy_movie = 
        {
            id: 1,
            title: "Interstellar",
            category: "Science Fiction",
            cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
            director: "Christopher Nolan",
            producer: "Emma Thomas, Christopher Nolan",
            synopsis: "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
            picture: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
            rating: "PG-13",
            nowPlaying: true
        }

    return(
        <div>
            <NavBar userType={userType}/>
            <div className='p-2 grid grid-cols-3'>
                <div className='text-black bg-white w-5/6 m-4 p-4 rounded-lg shadow-md flex justify-center items-center flex-col'>
                    <img src={dummy_movie.picture} alt='Poster' className='w-2/3 justify-center flex '/>
                    <h2 className='text-lg'>{dummy_movie.title}</h2>
                    <p>Rating: {dummy_movie.rating}</p>
                    <p>Category: {dummy_movie.category}</p>
                    <p>Director: {dummy_movie.director}</p>
                </div>
                <div className="col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2">
                            <div>
                                {Object.keys(movieSchedule).map((date) => (
                                <div key={date} className="mb-4">
                                <h2 className="text-lg font-semibold">{date}</h2>
                                <div className="flex space-x-2">
                                    {movieSchedule[date].map((showtime) => (
                                    <button
                                        key={showtime}
                                        className={`px-4 py-2 rounded ${selectedShowtime === showtime ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
                                        onClick={() => handleShowtimeSelect(showtime)}
                                    >
                                        {showtime}
                                    </button>
                                    ))}
                                </div>
                            </div>
                            ))}
                            </div>
                            <div>
                                {selectedShowtime && (
                                <div className="mt-4">
                                    <label className="block mb-2">Number of Seats:</label>
                                    <select value={numberOfSeats} onChange={handleSeatChange} className="border rounded p-2 text-black">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                    ))}
                                    </select>
                                </div>
                                )}

                            {numberOfSeats > 0 && selectedShowtime && (
                                <div className="mt-4">
                                {Array.from({ length: numberOfSeats }).map((_, index) => (
                                    <div key={index} className="mb-2">
                                    <label className="block">Age for Seat {index + 1}:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={ages[index] || ''}
                                        onChange={(e) => handleAgeChange(index, e.target.value)}
                                        className="border rounded p-2 text-black"
                                        required
                                    />
                                    </div>
                                ))}
                                </div>
                            )}

                            {selectedShowtime && (
                                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                                Submit
                                </button>
                            )}
                                <button onClick={handleCancel} className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}