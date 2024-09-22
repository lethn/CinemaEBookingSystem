"use client"
import { useState, useEffect } from "react";
import NavBar from "../components/navBar";

export default function OrderHistory() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    // use api call to fetch order history for logged in user

    const dummy_history = [
        {
            id: "1",
            email: "example@gmail.com",
            title: "Blade Runner 2049",
            purchaseDate: "09/21/2024",
            movieDate: "09/24/2024",
            seats: ["A1", "A2"],
            total: 50.00,
        },
        {
            id: "2",
            email: "example@gmail.com",
            title: "Interstellar",
            purchaseDate: "09/21/2024",
            movieDate: "09/25/2024",
            seats: ["B1"],
            total: 25.00,
        },
        {
            id: "3",
            email: "example@gmail.com",
            title: "Morbius",
            purchaseDate: "09/4/2024",
            movieDate: "09/06/2024",
            seats: ["C7"],
            total: 25.00,
        }
    ];


    return (
        <div>
            <NavBar userRole={userRole} />
            <div className="flex justify-center m-12 p-12">
                <div className="bg-white p-12 m-auto shadow-lg rounded-lg">
                    <table className="min-w-full border text-black">
                        <thead>
                            <tr>
                                <th className="border p-2">Order ID</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Movie</th>
                                <th className="border p-2">Purchase Date</th>
                                <th className="border p-2">Showing Date</th>
                                <th className="border p-2">Seats</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummy_history.map((order) => (
                                <tr key={order.id}>
                                    <td className="border p-2">{order.id}</td>
                                    <td className="border p-2">{order.email}</td>
                                    <td className="border p-2">{order.title}</td>
                                    <td className="border p-2">{order.purchaseDate}</td>
                                    <td className="border p-2">{order.movieDate}</td>
                                    <td className="border p-2">{order.seats}</td>
                                    <td className="border p-2">${order.total}</td>
                                    {/* change to display dollar ammount later*/}
                                </tr>
                                
                            
                            
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
