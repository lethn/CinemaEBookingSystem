"use client"
import { useRouter } from 'next/navigation';
import { useState, useContext } from 'react';
import { AuthContext } from "../contexts/user";
import Link from "next/link";
import axios from "axios";

export default function LoginForm({ redirectTo, role }) {
    const router = useRouter();
    const { signIn, isLoggedIn } = useContext(AuthContext);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signIn(email, password);
        } catch (error) {
            alert('Email or Password is incorrect or user is unverified');
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="bg-white p-8 shadow-lg w-80 rounded-lg">
            <form className='flex flex-col' onSubmit={handleSubmit}>
                <label className="font-medium text-black">
                    Username<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-md text-black"
                    required
                /> 
                
                <label className="font-medium text-black">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-md text-black"
                    required
                />

                <button type="submit"
                    className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                    Login
                </button>
            </form>

            <p className="font-medium mt-4 text-center">
                <Link
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                    href="/forgot-password">
                    Forgot Password
                </Link>
            </p>

            <p className="font-medium text-center">
                <span className="text-black">Not a user? </span>
                <Link
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                    href="/register">
                    Sign Up Here
                </Link>
            </p>
        </div>  
    )
}
