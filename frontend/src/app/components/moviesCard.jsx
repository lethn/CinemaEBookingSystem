import React, { useState } from 'react';
import Link from 'next/link';
import Modal from './Modal'; // Ensure the path is correct based on your file structure

const MovieCard = (props) => {
    const [showModal, setShowModal] = useState(false);

    const openModalHandler = () => setShowModal(true);
    const closeModalHandler = () => setShowModal(false);

    return (
        <div className="flex flex-col bg-white m-4 p-4 rounded-lg shadow-md">
            <div>
                <img src={props.picture} alt={`${props.title} poster`} className="object-contain rounded-md w-[300px] h-[400px]" />
            </div>
            <h2 className="text-xl text-black font-bold mt-2">{props.title}</h2>
            <p className="text-gray-700 mt-2">Rating: {props.rating}</p>
            <p className="text-gray-700 mt-2">{props.category}</p>

            <div className="flex justify-between mt-2 gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={openModalHandler}>
                    Trailer
                </button>

                <Link href="/movie" passHref>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Info
                    </button>
                </Link>

                {props.nowPlaying && (
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => alert('Booking Tickets')}
                    >
                        Book Tickets
                    </button>
                )}
            </div>

            <Modal isVisible={showModal} onClose={closeModalHandler}>
                <div className="aspect-w-16 aspect-h-9">
                    <iframe
                        width="100%"
                        height="400px"
                        src={props.trailer.replace("watch?v=", "embed/")}
                        title={`${props.title} trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </Modal>
        </div>
    );
};

export default MovieCard;
