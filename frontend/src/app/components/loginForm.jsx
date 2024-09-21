"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm({ redirectTo, role }) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Store the role (user or admin) in localStorage
        localStorage.setItem('userRole', role);

        router.push(redirectTo);
    };

    return (
        <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                required
            /> <br />
            <input
                type="password"
                placeholder="Password"
                className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                required
            /> <br />
            <button type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                Login
            </button>
        </form>
    )
}
