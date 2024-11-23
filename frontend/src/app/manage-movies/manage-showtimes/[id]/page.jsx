"use client";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/contexts/user";
import NavBar from "@/app/components/navBar";
import RestrictedPage from "@/app/components/restrictedPage";
import LoadingPage from "@/app/components/loadingPage";
import Pagination from "@/app/components/Pagination";
import axios from "axios";

export default function EditMovies({ params }) {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [theatreMap, setTheatreMap] = useState({});
    const [showroomMap, setShowroomMap] = useState({});
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [selectedShowroom, setSelectedShowroom] = useState("");
    const [showrooms, setShowrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const sortedShowtimes = [...showtimes].sort((a, b) => {
        const theatreA = theatreMap[a.theatreId] || "";
        const theatreB = theatreMap[b.theatreId] || "";

        // Sort by theatre
        if (theatreA.localeCompare(theatreB) !== 0) {
            return theatreA.localeCompare(theatreB);
        }

        // Sort by date/time
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        if (dateA - dateB !== 0) {
            return dateA - dateB;
        }

        // Sort by showroom name if the same date, time, and theatre
        const showroomA = showroomMap[a.showroomId] || "";
        const showroomB = showroomMap[b.showroomId] || "";
        return showroomA.localeCompare(showroomB);
    });


    // List of Showtimes Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const showtimesPerPage = 5;
    const indexOfLastShowtime = currentPage * showtimesPerPage;
    const indexOfFirstShowtime = indexOfLastShowtime - showtimesPerPage;
    const currentShowtimes = sortedShowtimes.slice(indexOfFirstShowtime, indexOfLastShowtime);
    const totalPages = Math.ceil(sortedShowtimes.length / showtimesPerPage);

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [movieResponse, theatresResponse, showroomsResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/movies/${id}`),
                    axios.get("http://localhost:8080/theatres"),
                    axios.get("http://localhost:8080/showrooms"),
                ]);

                const movieData = movieResponse.data;
                const theatresData = theatresResponse.data;
                const showroomsData = showroomsResponse.data;

                setMovie(movieData);
                setShowtimes(movieData.shows);

                const theatreMap = {};
                theatresData.forEach((theatre) => {
                    theatreMap[theatre.id] = theatre.friendlyName;
                });

                const showroomMap = {};
                showroomsData.forEach((showroom) => {
                    showroomMap[showroom.id] = showroom.friendlyName;
                });

                setTheatreMap(theatreMap);
                setShowroomMap(showroomMap);
                setTheatres(theatresData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleDeleteShowtime = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/shows/${id}`);
            const updatedShowtimes = showtimes.filter((show) => show.id !== id);
            setShowtimes(updatedShowtimes);

            if (updatedShowtimes.length > 0 && indexOfFirstShowtime >= updatedShowtimes.length && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error("Error deleting showtime:", error);
            alert("Failed to delete the showtime. Please try again later.");
        }
    };

    const handleTheatreChange = (e) => {
        const theatreId = parseInt(e.target.value);
        setSelectedTheatre(theatreId);
        setSelectedShowroom("");

        const selectedTheatre = theatres.find((theatre) => theatre.id === theatreId);
        setShowrooms(selectedTheatre ? selectedTheatre.showrooms : []);
    };

    const handleShowroomChange = (e) => {
        setSelectedShowroom(parseInt(e.target.value));
    };

    const handleAddShowtime = async (e) => {
        e.preventDefault();

        if (!selectedTheatre || !selectedShowroom) {
            alert("Please select both a theatre and a showroom.");
            return;
        }

        const showDateTime = `${date}T${time}:00`;

        try {
            const response = await axios.post(
                `http://localhost:8080/shows?movieId=${id}&showroomId=${selectedShowroom}&theatreId=${selectedTheatre}`,
                { time: showDateTime }
            );
            alert("Showtime added successfully!");

            const newShowtime = response.data;
            setShowtimes((prevShowtimes) => [...prevShowtimes, newShowtime]);
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.message || error.response.data}`);
            } else {
                console.error("Error adding showtime:", error);
                alert("Failed to add the showtime. Please try again later.");
            }
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div className="min-h-screen bg-neutral-900 text-white">
                <NavBar userType={userType} />

                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-semibold text-center mb-6">Manage Showtimes</h1>

                    <div className="flex flex-col lg:flex-row items-center gap-8 mb-10">
                        <div className="w-full lg:w-1/2 flex flex-col items-center">
                            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                                <img
                                    src={movie.picture}
                                    alt={movie.title}
                                    className="w-full max-w-md object-cover rounded-lg shadow-lg"
                                />
                                <div className="text-center mt-4">
                                    <h2 className="text-4xl font-semibold">{movie.title}</h2>
                                    <p className="text-lg">Genre: {movie.category}</p>
                                    <p className="text-lg">Rating: {movie.rating}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3">
                            <form onSubmit={handleAddShowtime} className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-3xl font-semibold mb-6 text-center">Add New Showtime</h2>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={handleDateChange}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Time <span className="text-red-500">*</span></label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={handleTimeChange}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Theatre <span className="text-red-500">*</span></label>
                                    <select value={selectedTheatre} onChange={handleTheatreChange} className="w-full p-3 rounded-lg bg-neutral-700/50 text-white hover:bg-neutral-700" required>
                                        <option value="">Select Theatre</option>
                                        {theatres.map((theatre) => (
                                            <option key={theatre.id} value={theatre.id}>{theatre.friendlyName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Showroom <span className="text-red-500">*</span></label>
                                    <select value={selectedShowroom} onChange={handleShowroomChange} className="w-full p-3 rounded-lg bg-neutral-700/50 text-white hover:bg-neutral-700" required>
                                        <option value="">Select Showroom</option>
                                        {showrooms.map((showroom) => (
                                            <option key={showroom.id} value={showroom.id}>{showroom.friendlyName}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white p-3 mt-2 rounded-lg hover:bg-green-800 transition duration-300"
                                >
                                    Add Showtime
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-semibold mb-6 text-center">List of Showtimes</h2>

                        <div className="grid grid-cols-5 gap-2 px-3 py-1 bg-neutral-700 border-gray-500 text-white rounded-lg font-semibold hidden md:grid mb-4">
                            <p className="p-3 text-lg text-center">Theatre</p>
                            <p className="p-3 text-lg text-center">Showroom</p>
                            <p className="p-3 text-lg text-center">Date</p>
                            <p className="p-3 text-lg text-center">Time</p>
                            <p className="p-3 text-lg text-center">Delete Showtime</p>
                        </div>

                        <div className="grid gap-4">
                            {currentShowtimes.length > 0 ? (
                                currentShowtimes.map((show) => {
                                    const startTime = new Date(show.time);
                                    const endTime = new Date(startTime.getTime() + movie.durationInMinutes * 60000);

                                    return (
                                        <div
                                            key={show.id}
                                            className="grid items-center justify-center grid-cols-1 md:grid-cols-5 gap-2 p-3 border-gray-500 text-white bg-neutral-700/50 rounded-lg hover:bg-neutral-700"
                                        >
                                            <div className="text-center">{theatreMap[show.theatreId] || "Unknown Theatre"}</div>
                                            <div className="text-center">{showroomMap[show.showroomId] || "Unknown Showroom"}</div>
                                            <div className="font-bold text-lg text-center">
                                                {startTime.toLocaleDateString()}
                                            </div>
                                            <div className="font-bold text-lg text-center">
                                                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                            <div className="text-center">
                                                <button
                                                    onClick={() => handleDeleteShowtime(show.id)}
                                                    className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-navBarRed hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center mt-6 text-gray-400/70">No showtimes available at the moment</p>
                            )}
                        </div>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChangePage={handleChangePage}
                        pagesPerRow={20}
                    />
                </div>
            </div>
        );
    }

    return <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />;
}
