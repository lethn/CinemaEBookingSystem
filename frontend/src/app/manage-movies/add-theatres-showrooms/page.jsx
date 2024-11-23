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
    const [showroomName, setShowroomName] = useState("");
    const [theatreID, setTheatreID] = useState("");

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

        axios.post("http://localhost:8080/theatres", {
                "friendlyName": theatreName,
                "showrooms": []
            }).then((response) => {
                console.log(response.data);
                fetchTheatres();
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

    const handleAddShowroom = async (e) => {

        e.preventDefault();

        if(showroomName == "") {
            alert("Showroom Name is required");
            return;
        }

        axios.post(`http://localhost:8080/showrooms?theatreId=${theatreID}`, {
                "friendlyName": showroomName,
                "seats": [
                    "A1",
                    "A2",
                    "A3",
                    "A4",
                    "A5",
                    "A6",
                    "A7",
                    "A8",
                    "A9",
                    "A10",
                    "A11",
                    "A12",
                    "A13",
                    "A14",
                    "A15",
                    "A16",
                    "A17",
                    "A18",
                    "A19",
                    "A20",
                    "A21",
                    "A22",
                    "A23",
                    "A24",
                    "A25",
                    "B1",
                    "B2",
                    "B3",
                    "B4",
                    "B5",
                    "B6",
                    "B7",
                    "B8",
                    "B9",
                    "B10",
                    "B11",
                    "B12",
                    "B13",
                    "B14",
                    "B15",
                    "B16",
                    "B17",
                    "B18",
                    "B19",
                    "B20",
                    "B21",
                    "B22",
                    "B23",
                    "B24",
                    "B25",
                    "D1",
                    "D2",
                    "D3",
                    "D4",
                    "D5",
                    "D7",
                    "D8",
                    "D9",
                    "D10",
                    "D11",
                    "D12",
                    "D13",
                    "D14",
                    "D15",
                    "D16",
                    "D17",
                    "D18",
                    "D19",
                    "D21",
                    "D22",
                    "D23",
                    "D24",
                    "D25",
                    "E1",
                    "E2",
                    "E3",
                    "E4",
                    "E5",
                    "E7",
                    "E8",
                    "E9",
                    "E10",
                    "E11",
                    "E12",
                    "E13",
                    "E14",
                    "E15",
                    "E16",
                    "E17",
                    "E18",
                    "E19",
                    "E21",
                    "E22",
                    "E23",
                    "E24",
                    "E25",
                    "F1",
                    "F2",
                    "F3",
                    "F4",
                    "F5",
                    "F7",
                    "F8",
                    "F9",
                    "F10",
                    "F11",
                    "F12",
                    "F13",
                    "F14",
                    "F15",
                    "F16",
                    "F17",
                    "F18",
                    "F19",
                    "F21",
                    "F22",
                    "F23",
                    "F24",
                    "F25",
                    "G1",
                    "G2",
                    "G3",
                    "G4",
                    "G5",
                    "G7",
                    "G8",
                    "G9",
                    "G10",
                    "G11",
                    "G12",
                    "G13",
                    "G14",
                    "G15",
                    "G16",
                    "G17",
                    "G18",
                    "G19",
                    "G21",
                    "G22",
                    "G23",
                    "G24",
                    "G25",
                    "H1",
                    "H2",
                    "H3",
                    "H4",
                    "H5",
                    "H7",
                    "H8",
                    "H9",
                    "H10",
                    "H11",
                    "H12",
                    "H13",
                    "H14",
                    "H15",
                    "H16",
                    "H17",
                    "H18",
                    "H19",
                    "H21",
                    "H22",
                    "H23",
                    "H24",
                    "H25",
                    "I1",
                    "I2",
                    "I3",
                    "I4",
                    "I5",
                    "I7",
                    "I8",
                    "I9",
                    "I10",
                    "I11",
                    "I12",
                    "I13",
                    "I14",
                    "I15",
                    "I16",
                    "I17",
                    "I18",
                    "I19",
                    "I21",
                    "I22",
                    "I23",
                    "I24",
                    "I25",
                    "J1",
                    "J2",
                    "J3",
                    "J4",
                    "J5",
                    "J7",
                    "J8",
                    "J9",
                    "J10",
                    "J11",
                    "J12",
                    "J13",
                    "J14",
                    "J15",
                    "J16",
                    "J17",
                    "J18",
                    "J19",
                    "J21",
                    "J22",
                    "J23",
                    "J24",
                    "J25",
                    "K1",
                    "K2",
                    "K3",
                    "K4",
                    "K5",
                    "K7",
                    "K8",
                    "K9",
                    "K10",
                    "K11",
                    "K12",
                    "K13",
                    "K14",
                    "K15",
                    "K16",
                    "K17",
                    "K18",
                    "K19",
                    "K21",
                    "K22",
                    "K23",
                    "K24",
                    "K25",
                    "L1",
                    "L2",
                    "L3",
                    "L4",
                    "L5",
                    "L7",
                    "L8",
                    "L9",
                    "L10",
                    "L11",
                    "L12",
                    "L13",
                    "L14",
                    "L15",
                    "L16",
                    "L17",
                    "L18",
                    "L19",
                    "L21",
                    "L22",
                    "L23",
                    "L24",
                    "L25"
                ]
            }).then((response) => {
                console.log(response.data);
                fetchTheatres();
                alert("Showroom added successfully!");

                setShowroomName("");
            }).catch((error) => {
                console.error(error);
                alert("Failed to add showroom. Please try again.");
                setShowroomName("");
            });

    };

    const handleDeleteShowroom = async (roomId, theatreId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this showroom?");
        if (!confirmDelete)
            return;

        try {
            await axios.delete(`http://localhost:8080/showrooms?theatreId=${theatreId}&showroomId=${roomId}`);
            alert("Showroom deleted successfully!");

            fetchTheatres();
        } catch (error) {
            console.error("Error deleting showroom:", error);
            alert("Failed to delete the room. Please try again later.");
        }
    };

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div className="">
                <NavBar userType={userType} />
                <div className="flex flex-col items-center p-4">
                    <h2 className="text-4xl font-semibold mb-2 w-full">Manage Theatres and Showrooms</h2>

                    <div className="flex gap-4">
                        {/* theatres */}
                        <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                            <h2 className="text-3xl font-semibold text-white mb-4 text-center">Add Theatre</h2>

                            <div className="flex gap-4">
                                <div className="flex flex-col col-span-3 md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={theatreName}
                                            placeholder="Theatre Name"
                                            onChange={(e) => setTheatreName(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddTheatre}
                                    className="font-semibold text-center px-2 rounded-lg text-white bg-green-600 hover:bg-green-800 w-full md:w-auto transition duration-300 ease-in-out"
                                >
                                    Add Theatre
                                </button>
                            </div>
                        </div>

                        {/* showrooms */}
                        <div className="bg-neutral-800/80 p-6 m-6 shadow-lg rounded-lg mx-auto max-w-7xl">
                            <h2 className="text-3xl font-semibold text-white mb-4 text-center">Add Showroom</h2>

                            <div className="flex gap-4">
                                <div className="flex flex-col col-span-2 md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={showroomName}
                                            placeholder="Showroom Name"
                                            onChange={(e) => setShowroomName(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <select 
                                        value={theatreID}
                                        onChange={(e) => setTheatreID(e.target.value)}
                                        className="rounded-lg w-full h-full p-3 bg-neutral-700/50 text-white hover:bg-neutral-700"
                                        >
                                            <option value="" disabled selected>Theatre ID</option>
                                        {
                                            theatres.map((theatre) => (
                                                <option>{theatre.id}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <button
                                    onClick={handleAddShowroom}
                                    className="font-semibold text-center px-2 rounded-lg text-white bg-green-600 hover:bg-green-800 w-full md:w-auto transition duration-300 ease-in-out"
                                >
                                    Add Showroom
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Display */}
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
                                                                onClick={() => handleDeleteShowroom(room.id, theatre.id)}
                                                                className="font-semibold text-center px-2 rounded-lg text-white bg-navBarRed hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
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
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-navBarRed hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
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
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
