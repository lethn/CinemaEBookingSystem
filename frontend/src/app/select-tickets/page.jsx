"use client";

import React, { useState } from 'react';

const MovieShowtimeSelector = () => {
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [numSeats, setNumSeats] = useState(1);
  const [ages, setAges] = useState(['']);

  const showtimes = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

  const handleSeatsChange = (event) => {
    const value = event.target.value;
    setNumSeats(value);
    setAges(Array.from({ length: value }, (_, i) => ages[i] || ''));
  };

  const handleAgeChange = (index, value) => {
    const newAges = [...ages];
    newAges[index] = value;
    setAges(newAges);
  };

  const handleShowtimeSelect = (time) => {
    setSelectedShowtime(time);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ selectedShowtime, numSeats, ages });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Showtime</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Choose a Showtime</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {showtimes.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleShowtimeSelect(time)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                selectedShowtime === time
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border-blue-500'
              } hover:bg-blue-400 hover:text-white`}
            >
              {time}
            </button>
          ))}
        </div>

        <div>
          <label className="block mb-2">
            Number of Seats:
            <input
              type="number"
              min="1"
              value={numSeats}
              onChange={handleSeatsChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </label>
        </div>

        <h3 className="text-lg font-semibold">Enter Ages for Each Seat</h3>
        {Array.from({ length: numSeats }).map((_, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">
              Seat {index + 1} Age:
              <input
                type="number"
                min="0"
                value={ages[index] || ''}
                onChange={(e) => handleAgeChange(index, e.target.value)}
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={!selectedShowtime}
          className={`w-full py-2 rounded-md text-white ${
            selectedShowtime ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MovieShowtimeSelector;