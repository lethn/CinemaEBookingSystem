"use client"
import { useState, useEffect } from "react";
import NavBar from "../components/navBar";

export default function ManageUsers() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role); // Set role to state
    }, []);

    return (
        <div>
            <NavBar userRole={userRole} />
            Manage Promotions
        </div>
    );
}
