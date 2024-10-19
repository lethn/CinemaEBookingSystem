"use client";
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkID, setCheckID] = useState(null);
    const [registeredEmail, setRegisteredEmail] = useState(''); // New state for registered email
    const router = useRouter();

    useEffect(() => {
        const storedUserID = localStorage.getItem("userID");
        if (storedUserID) {
            setCheckID(storedUserID);
            setIsLoggedIn(true);
        }
    }, []);

    const signIn = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:8080/login", {
                "email": email,
                "password": password
            });
            console.log(response.data.userId);

            setIsLoggedIn(true);
            setCheckID(response.data.id);
            localStorage.setItem("userID", response.data.id);
            localStorage.setItem("userType", response.data.userType);

            router.push("/");
        } catch (error) {
            alert('Email or Password is incorrect or user is unverified');
            console.error("Error: ", error);
        }
    };

    const signOut = () => {
        localStorage.removeItem("userID");
        localStorage.removeItem("userType");
        setIsLoggedIn(false);
        setCheckID(null);
        setRegisteredEmail('');
        router.push("/login");
    };

    const setEmailForRegistration = (email) => {
        setRegisteredEmail(email);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, registeredEmail, setEmailForRegistration }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
