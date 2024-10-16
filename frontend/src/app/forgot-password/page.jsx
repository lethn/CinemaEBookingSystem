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
            <div className="inline-flex justify-center items-center w-full">
                <div className="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>
                    <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                            required
                        /> <br />
                        <button type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>

            {emailSent && (
                <>
                    <div className="flex justify-center m-2 p-12">
                        <div className="bg-white p-12 m-auto shadow-lg rounded-lg">
                            <p className="text-center text-black font-bold text-4xl pb-8">Thank you for registering!</p>
                            <p className="text-center text-black mt-2 text-lg">A 6-digit verification code has been sent to your email: <strong>{email}</strong></p>

                            <form onSubmit={handleSubmitPassword} className="mt-6">
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
                                <input
                                    type="text"
                                    id="newPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="text-black w-full p-3 border border-gray-300 rounded-md"
                                    required
                                />
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
                                    className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700">
                                    Confirm
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}