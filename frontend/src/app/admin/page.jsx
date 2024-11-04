"use client"
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';

export default function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}