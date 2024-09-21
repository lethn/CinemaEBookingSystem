import React from 'react';

const MovieCard = (props) => {
    return (
        <div className="flex flex-col bg-white m-4 p-4 rounded-lg shadow-md">
            <img src={props.picture} alt={`${props.title} poster`} className="w-full h-64 object-cover rounded-md" />
            <h2 className="text-xl text-black font-bold mt-2">{props.title}</h2>
            <p className="text-gray-700 mt-2">Rating: {props.rating}</p>
            <p className="text-gray-700 mt-2">{props.category}</p>

            <div className="flex justify-between mt-2 gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => alert('Trailer')}
                >
                    Trailer
                </button>
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => alert('More info')}
                >
                    Info
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => alert('Booking Tickets')}
                >
                    Book Tickets
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
