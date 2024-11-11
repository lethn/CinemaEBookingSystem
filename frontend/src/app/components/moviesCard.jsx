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
        <div className="flex flex-col bg-neutral-800/60 shadow-md group overflow-hidden">
            <Link href={`/movie/${props.id}`} passHref>
                <div className="flex justify-between items-center px-2 my-2">
                    <h2 className="text-xl text-white font-bold">{props.title}</h2>
                    <p className="text-white border-2 border-white flex items-center justify-center px-1">{props.rating}</p>
                </div>
            </Link>
            <div className="relative">
                <Link href={`/movie/${props.id}`} passHref>
                    <img src={props.picture} alt={`${props.title} poster`} className="object-cover w-[320px] h-[440px] object-fill" />
                </Link>
                
                {/* Region that will slide up over the image */}
                <div className="absolute bottom-0 left-0 w-full bg-neutral-900/80 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <p className="text-white">{props.category}</p>
                <p className='text-white'>Director: {props.director}</p>
                <p className='text-white'>Duration: {props.durationInMinutes} minutes</p>

                <div className="flex justify-between mt-2 gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out" onClick={openModalHandler}>
                    Trailer
                    </button>

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
                </div>
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
