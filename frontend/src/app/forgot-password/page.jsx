"use client"
import NavBar from "../components/navBar";
import { useState } from 'react';


export default function Login() {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // send email

        setEmailSent(true);
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            alert(error);
            return;
        }

        // Clear any previous errors
        setError('');

        if (verificationCode === '123456') {

            // TO DO: change password for user in DB

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
            <div className="flex flex-col min-h-screen">
                {!emailSent && (
                    <div className="flex flex-col p-24 mx-auto items-center">
                        <h2 className="text-3xl font-semibold mb-6">Forgot Password?</h2>
                        <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                        <label className="font-medium text-black">
                            Email
                        </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-md text-black"
                                required
                            />
                            <button type="submit"
                                className="w-full bg-red-800 text-white p-3 rounded-md hover:bg-red-900">
                                Reset Password
                            </button>
                        </form>
                    </div>
                )}

                {emailSent && (
                    <div className="flex flex-col p-24 mx-auto items-center">
                        <label htmlFor="verificationCode" className="text-3xl font-semibold mb-6">
                            Create New Password
                        </label>
                        <form onSubmit={handleSubmitPassword} className="bg-white p-8 shadow-lg w-80 rounded-lg">
                            <p className="text-black mb-2">A 6-digit verification code has been sent to your email: <strong>{email}</strong></p>
                            <label className="font-medium text-black">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                id="verificationCode"
                                placeholder="Email Verification Code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-md text-black"
                                required
                            />
                            <label className="font-medium text-black">
                                New Password
                            </label>
                            <input
                                type="text"
                                id="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full p-3 mt-1 mb-4 border border-gray-300 rounded-md text-black"
                                required
                            />
                            <label className="font-medium text-black">
                                Confirm Password
                            </label>
                            <input
                                type="text"
                                id="confirmPassword"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-black w-full p-3 border border-gray-300 rounded-md"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-red-800 text-white p-3 mt-6 rounded-md hover:bg-red-900">
                                Confirm
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}