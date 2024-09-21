"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import NavBar from "../components/navBar";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Clear any previous errors
        setError('');

        // Perform registration logic (e.g., API call)
        
        // Store the role (user or admin) in localStorage
        localStorage.setItem('userRole', "user");

        // Redirect to a specified route
        router.push('/');  // Adjust the path as needed
    };

    return (
        <div>
            <NavBar/>
            <div className="flex justify-center items-center h-screen">
                <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-6 text-black">Register</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full p-3 mb-6 border border-gray-300 rounded-md text-black"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
