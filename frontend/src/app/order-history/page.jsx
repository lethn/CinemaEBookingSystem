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
        }
    ];


    return (
        <div>
            <NavBar userRole={userRole} />
            Order History
        </div>
    );
}
