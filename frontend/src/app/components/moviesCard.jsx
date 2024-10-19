"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Modal from './Modal';

const MovieCard = (props) => {
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const openModalHandler = () => setShowModal(true);
    const closeModalHandler = () => setShowModal(false);

    const buyTickets = (e) => {
        e.preventDefault();
        if (userType === "CUSTOMER") {
            router.push("/select-tickets");
        } else {
            alert("You must be a customer and log in to book tickets");
        }
    };

    return (
        <div className="flex flex-col bg-neutral-800/60 m-4 p-4 rounded-lg shadow-md">
            <div>
                <img src={props.picture} alt={`${props.title} poster`} className="object-contain rounded-lg w-[300px] h-[400px]" />
            </div>
            <h2 className="text-xl text-white font-bold mt-2">{props.title}</h2>
            <p className="text-white mt-2">Rating: {props.rating}</p>
            <p className="text-white mt-2">{props.category}</p>

            <div className="flex justify-between mt-2 gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out" onClick={openModalHandler}>
                    Trailer
                </button>

                <Link href={`/movie/${props.id}`} passHref>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out">
                        Info
                    </button>
                </Link>

                {props.nowPlaying && (
                    <button
                        className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${userType === "CUSTOMER"
                                ? "bg-green-500 hover:bg-green-700 text-white"
                                : "bg-gray-300 cursor-not-allowed text-white"
                            }`}
                        onClick={buyTickets}
                        disabled={userType !== "CUSTOMER"}
                    >
                        Book Tickets
                    </button>
                )}
            </div>

            <Modal isVisible={showModal} onClose={closeModalHandler}>
                <div className="aspect-w-16 aspect-h-9">
                    <iframe
                        width="100%"
                        height="500px"
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
