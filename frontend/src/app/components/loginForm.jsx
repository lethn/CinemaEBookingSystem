"use client"
import { useState, useContext } from 'react';
import { AuthContext } from "../contexts/user";
import Link from "next/link";

export default function LoginForm() {
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
        <div className="bg-neutral-800/60 p-8 shadow-lg w-96 rounded-lg m-4">
            <h2 className="text-4xl font-semibold mb-6">Login</h2>
            <form className='flex flex-col p-2 m-2' onSubmit={handleSubmit}>
                <label className="font-medium text-white">
                    Username<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none"
                    required
                />

                <label className="font-medium text-white">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none"
                    required
                />

                <button type="submit"
                    className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                    Login
                </button>
            </form>

            <p className="font-medium mt-4 text-center">
                <Link
                    className="text-white hover:underline"
                    href="/forgot-password">
                    Forgot Password?
                </Link>
            </p>

            <p className="font-medium text-center mt-2">
                <span className="text-stone-400">Not a user? </span>
                <Link
                    className="text-white hover:underline"
                    href="/register">
                    Sign Up Here
                </Link>
            </p>
        </div>
    )
}
