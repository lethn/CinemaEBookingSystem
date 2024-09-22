"use client"
import { useState, useEffect } from "react";
import NavBar from "../components/navBar";

export default function OrderSummary() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    return (
        <div>
            <NavBar userRole={userRole} />
            Order Summary
        </div>
    );
}
