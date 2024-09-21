"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import NavBar from "../../components/navBar";

export default function ConfirmEmail() {
    const router = useRouter();
    const [userCode, setUserCode] = useState();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic code validation
        // update later
        if (false) {
            setError('Incorrect Code');
            return;
        }

        // Clear any previous errors
        setError('');

        // Perform registration logic (e.g., API call)

        // Redirect to a specified route
        router.push('/');  // Adjust the path as needed
    };

    return (
        <div>
            <NavBar/>
            <div className="flex justify-center items-center h-screen">
                <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-2 text-black">Confirm Email</h2>
                    <p className="text-black text-xs mb-4"> Check your email for a 6 digit verification code</p>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input
                        type="int"
                        placeholder="Email Verification Code"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="block w-full p-3 mb-6 border border-gray-300 rounded-md text-black"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    )
}