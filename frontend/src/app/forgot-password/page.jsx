"use client"
import NavBar from "../components/navBar";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [customerID, setCustomerID] = useState('');

    const handleSubmitRequestCode = async (e) => {
        e.preventDefault();
        try {
            // Fetch all customers and find the one with the matching email
            const customersResponse = await axios.get(`http://localhost:8080/customers`);
            const customers = customersResponse.data;
            const customer = customers.find(c => c.email === email);

            if (!customer) {
                alert("Email does not exist in our records.");
                return;
            }

            setCustomerID(customer.id);

            // Generate the password reset code
            const response = await axios.post(`http://localhost:8080/customers/password-reset/generate`, null, {
                params: { email }
            });
            console.log(response.data);
            setEmailSent(true);
        } catch (error) {
            console.error('Error sending password reset request', error);
            alert('Failed to send reset email. Please try again.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/customers/${customerID}`);
            if (response.status === 200) {
                const customer = response.data;
                if (customer.passwordResetCode === verificationCode) {
                    setIsCodeVerified(true);
                } else {
                    alert('Invalid verification code.');
                }
            } else {
                alert('Customer not found.');
            }
        } catch (error) {
            console.error('Error verifying code', error);
            alert('Failed to verify code. Please try again.');
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNewPassword("");
            setConfirmPassword("");
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setNewPassword("");
            setConfirmPassword("");
            alert('Password must be at least 8 characters');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/customers/password-reset/reset?email=${email}&token=${verificationCode}&newPassword=${newPassword}`);

            console.log(response.data);
            if (response.status === 200) {
                alert("Reset password successfully!")
                router.push('/login');
            } else {
                alert('Invalid verification code or failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password', error);
            alert('Failed to reset password. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex flex-col min-h-screen">
                {!emailSent && (
                    <div className="flex flex-col p-24 mx-auto items-center">
                        <div className="bg-neutral-800/60 p-8 shadow-lg rounded-lg m-4">
                            <h2 className="text-4xl font-semibold mb-6">Forgot Password?</h2>
                            <form className="flex flex-col p-2 m-2" onSubmit={handleSubmitRequestCode}>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full p-3 mt-1 mb-4 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                                <button type="submit"
                                    className="w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {emailSent && !isCodeVerified && (
                    <div className="flex flex-col p-24 mx-auto items-center">
                        <div className="bg-neutral-800/60 p-8 shadow-lg rounded-lg m-4">
                            <h2 className="text-4xl font-semibold mb-6">Enter Verification Code</h2>
                            <form onSubmit={handleVerifyCode} className="flex flex-col p-2 m-2">
                                <p className="text-white mb-4">
                                    A verification code has been sent to your email: <strong>{email}</strong>
                                </p>
                                <label className="font-medium text-white">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter Verification Code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="block w-full p-3 mt-1 mb-4 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Verify Code
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {isCodeVerified && (
                    <div className="flex flex-col p-24 mx-auto items-center">
                        <div className="bg-neutral-800/60 p-8 shadow-lg rounded-lg m-4">
                            <h2 className="text-4xl font-semibold mb-6">Create New Password</h2>
                            <form onSubmit={handleSubmitPassword} className="flex flex-col p-2 m-2">
                                <label className="font-medium text-white">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full p-3 mt-1 mb-4 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                                <label className="font-medium text-white">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full p-3 mt-1 mb-4 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Confirm
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
