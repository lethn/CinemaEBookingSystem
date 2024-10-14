"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar";

export default function RegisterConfirmation() {
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState('');

    const email = 'example@gmail.com'; // Example email for template



    const handleSubmit = (e) => {
        e.preventDefault();
        

        // Check for correct verification code
        // Update user status to ACTIVE in DB
        // return user to homepage logged in

        if (verificationCode === '123456') {

            // set userID in localStorage
            localStorage.setItem('userRole', "user");
            router.push("/");
        } else {
            alert('Invalid verification code.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex justify-center m-12 p-12">
                <div className="bg-white p-12 m-auto shadow-lg rounded-lg">
                    <p className="text-center text-black font-bold text-4xl pb-8">Thank you for registering!</p>
                    <p className="text-center text-black mt-2 text-lg">A 6-digit verification code has been sent to your email: <strong>{email}</strong></p>

                    <form onSubmit={handleSubmit} className="mt-6">
                        <label htmlFor="verificationCode" className="block text-black text-xl font-semibold mb-2">
                            Confirm Email
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            placeholder="Email Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="text-black w-full p-3 border border-gray-300 rounded-md"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700">
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
