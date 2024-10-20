"use client"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';

export default function ManageUsers() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />
                <h1 className="text-3xl font-semibold text-white m-2 p-2">
                    Manage Users
                </h1>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
