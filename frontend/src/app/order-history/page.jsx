"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../contexts/user";
import NavBar from "../components/navBar";
import Pagination from "../components/Pagination";
import RestrictedPage from "../components/restrictedPage";
import LoadingPage from "../components/loadingPage";
import axios from "axios";

export default function ManageMovies() {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/customers/${userID}`);
            setOrders(response.data.bookings);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const changePageHandler = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCancelBooking = async (orderId, isLessThanAnHour) => {
        let confirmDelete;
        if (isLessThanAnHour) {
            confirmDelete = window.confirm("Are you sure you want to cancel? You will not receive a refund.");
        } else {
            confirmDelete = window.confirm("Are you sure you want to cancel? Your refund will be processed to the original payment card.");
        }
        if (!confirmDelete)
            return;

        try {
            await axios.delete(`http://localhost:8080/bookings/${orderId}`);
            const updatedOrders = orders.filter((order) => order.id !== orderId);
            setOrders(updatedOrders);

            if (updatedOrders.length > 0 && indexOfFirstOrder >= updatedOrders.length && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Failed to delete the booking. Please try again later.");
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar userType={userType} />
                <div className="flex-grow flex flex-col items-center justify-center m-4">
                    <div className="bg-neutral-800/80 p-6 shadow-lg rounded-lg mx-16">
                        <h2 className="text-3xl font-semibold text-white mb-4 text-center">Previous Bookings</h2>
                        <div className="grid grid-cols-[2fr_4fr_3fr_1fr_3fr_2fr] justify-center items-center gap-2 px-3 py-1 bg-neutral-700 text-white rounded-lg font-semibold md:grid mb-4">
                            <p className="p-3 text-lg text-center">Order ID</p>
                            <p className="p-3 text-lg text-center">Movie</p>
                            <p className="p-3 text-lg text-center">Showtime</p>
                            <p className="p-3 text-lg text-center">Total</p>
                            <p className="p-3 text-lg text-center">Payment Card</p>
                            <p className="p-3 text-lg text-center">Cancel Booking</p>
                        </div>

                        <div className="grid gap-4">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid items-center justify-center grid-cols-[2fr_4fr_3fr_1fr_3fr_2fr] gap-2 p-3 text-white bg-neutral-700/50 rounded-lg hover:outline outline-1 outline-navBarRed"
                                    >
                                        <div className="font-bold text-lg text-center">{order.id}</div>
                                        <div className="text-center">{order.movieTitle}</div>
                                        <div className="text-center">{new Date(order.showTime).toLocaleString([], {
                                            month: '2-digit', 
                                            day: '2-digit',
                                            year: '2-digit', 
                                            hour: 'numeric', 
                                            minute: 'numeric'
                                        })}</div>
                                        <div className="text-center">${order.totalCost.toFixed(2)}</div>
                                        <div className="text-center">{order.paymentCardFriendlyName}</div>
                                        <div className="text-center">
                                            {new Date(order.showTime) > new Date() ? (
                                                <button
                                                    onClick={() => handleCancelBooking(order.id, new Date(order.showTime) - new Date() < 3600000)}
                                                    className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-navBarRed hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-red-800 w-full md:w-auto cursor-not-allowed"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-6 text-gray-400/70">No bookings found.</p>
                            )}
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChangePage={changePageHandler}
                        pagesPerRow={15}
                    />
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}
