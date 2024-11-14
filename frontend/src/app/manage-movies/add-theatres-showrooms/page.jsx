"use client"
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '@/app/contexts/user';
import NavBar from '@/app/components/navBar';
import RestrictedPage from '@/app/components/restrictedPage';
import axios from "axios";

export default function AddTheatresShowrooms() {
    const { isLoggedIn } = useContext(AuthContext);
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [theatres, setTheatres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [theatreName, setTheatreName] = useState("");

    const fetchTheatres = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/theatres");
            setTheatres(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching theatres:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTheatres();
    }, []);

    const handleAddTheatre = async (e) => {

        e.preventDefault();

        if(theatreName == "") {
            alert("Theatre Name is required");
            return;
        }

        axios
            .post("http://localhost:8080/theatres",{
                "friendlyName": theatreName,
                "showrooms": []
            }).then((response) => {
                console.log(response.data);
                setTheatres([response.data, ...theatres]);
                alert("Theatre added successfully!");

                setTheatreName("");
            }).catch((error) => {
                console.error(error);
                alert("Failed to add theatre. Please try again.");
            });

    };

    const handleDeleteTheatre = async (theatreId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this theatre?");
        if (!confirmDelete)
            return;

        try {
            await axios.delete(`http://localhost:8080/theatres/${theatreId}`);
            alert("Theatre deleted successfully!");

            setTheatres(theatres.filter((theatre) => theatre.id !== theatreId));
        } catch (error) {
            console.error("Error deleting theatre:", error);
            alert("Failed to delete the theatre. Please try again later.");
        }
    };


    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />
                <h1 className="text-3xl text-center font-semibold text-white m-2 p-2">
                    Manage Theatres and Showrooms
                </h1>

                <div className="grid grid-cols-2 gap-6 m-8 p-8">
                    {/* theatres */}
                    <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                        <h2 className="text-3xl font-semibold text-white mb-4 text-center">Add Theatre</h2>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex flex-col col-span-3 md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                    <label className="font-medium mb-1">
                                        Theatre Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={theatreName}
                                        onChange={(e) => setTheatreName(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-lg box-border text-black focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    onClick={handleAddTheatre}
                                    className="font-semibold text-center px-2  rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto"
                                >
                                    Add Theatre
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* showrooms */}
                    <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                        <h2 className="text-3xl font-semibold text-white mb-4 text-center">Add Showroom</h2>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex flex-col col-span-2 md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                    <label className="font-medium mb-1">
                                        Showroom Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={theatreName}
                                        onChange={(e) => setTheatreName(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-lg box-border text-black focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            
                            <div className="">
                                <div>
                                    <label className="font-medium mb-1">
                                    Theatre <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                
                                <select 
                                    name="showroom" id="room"
                                    className="rounded-lg text-black w-full h-12"
                                    >
                                    {
                                        theatres.map((theatre) => (
                                            <option>{theatre.id}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    onClick={handleAddTheatre}
                                    className="font-semibold text-center px-2  rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto"
                                >
                                    Add Showroom
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                    <h2 className="text-3xl font-semibold text-white mb-4 text-center">List of Theatres</h2>

                    <div className="grid grid-cols-4 justify-center items-center gap-5 px-3 py-1 bg-neutral-700 border-gray-500 text-white rounded-lg font-semibold hidden md:grid mb-4">
                        <p className="p-3 text-lg text-center">ID</p>
                        <p className="p-3 text-lg text-center">Name</p>
                        <p className="p-3 text-lg text-center">Showroom Info</p>
                        <p className="p-3 text-lg text-center">Delete Theatre</p>
                    </div>

                    <div className="grid gap-4">
                        {theatres.length > 0 ? (
                            theatres.map((theatre) => (
                                <div
                                    key={theatre.id}
                                    className="grid items-center justify-center grid-cols-1 md:grid-cols-4 gap-2 p-3 border-gray-500 text-white bg-neutral-700/50 rounded-lg hover:bg-neutral-700"
                                >
                                    <div className="font-bold text-lg text-center">{theatre.id}</div>
                                    <div className="text-center">{theatre.friendlyName}</div>
                                    <div>
                                        <div> {
                                            theatre.showrooms.map((room) => (
                                                <div className="grid grid-cols-3 m-2">
                                                    <div className="text-center">ID: {room.id}</div>
                                                    <div className="text-center">{room.friendlyName}</div>
                                                    <div className="text-center">
                                                        <button
                                                            onClick={() => handleDeleteTheatre(theatre.id)}
                                                            className="font-semibold text-center px-2  rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            onClick={() => handleDeleteTheatre(theatre.id)}
                                            className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-6 text-gray-400/70">No theatres available at the moment</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
