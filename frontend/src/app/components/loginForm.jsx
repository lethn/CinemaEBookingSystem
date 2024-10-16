"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from "axios";

export default function LoginForm({ redirectTo, role }) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Perform login logic (e.g., API call)
        axios.post('http://localhost:8080/login',
            {
                email: username,
                password: password,
            }
        ).then((response) => {
            console.log(response.data);

            // Store the role (user or admin) in localStorage
            // TO DO: set role as response.userType (CUSOMER, ADMIN)
            // must change elsewhere in frontend to reflect change
            // need some way to have user data persist across pages or know which user is logged in

            localStorage.setItem('userRole', role);

            router.push(redirectTo);
        }).catch((error) => {
            console.log(error);
            alert('Email or Password is incorrect or user is unverified');
        });
    };

    return (
        <div>
            <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                    required
                /> <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                    required
                /> <br />
                <button type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                    Login
                </button>
            </form>
            <div className="mt-4">
                <a className=" text-2xl font-semibold mb-2" href="/forgot-password">Forgot Password?</a>
            </div>
        </div>
    )
}
