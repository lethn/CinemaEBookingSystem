"use client"
import React, { useContext } from 'react';
import { AuthContext } from '@/app/contexts/user';
import NavBar from '@/app/components/navBar';
import RestrictedPage from '@/app/components/restrictedPage';

export default function AddMovies() {
    const { isLoggedIn } = useContext(AuthContext);
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />
                <h1 className="text-3xl font-semibold text-white m-2 p-2">
                    Add Movies
                </h1>


            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
