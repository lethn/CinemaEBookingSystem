"use client";
import { useState, useContext, useRef } from "react";
import { AuthContext } from "../contexts/user";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for API requests
import NavBar from "../components/navBar";

export default function RegisterConfirmation() {
    const router = useRouter();
    const verifyCodeRef = useRef(null);
    const { registeredEmail, setEmailForRegistration } = useContext(AuthContext);
    const [verificationCode, setVerificationCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/customers/verify`, {
                params: {
                    email: registeredEmail,
                    token: verificationCode,
                },
            });

            if (response.status === 200) {
                alert("Email verified successfully!");
                setEmailForRegistration("");
                router.push("/login");
            }
        } catch (error) {
            setVerificationCode("");
            console.error("Verification failed:", error);
            alert("Invalid verification code. Please try again.");
            verifyCodeRef.current.focus();
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex justify-center m-12 p-12">
                <div className="bg-white p-12 m-auto shadow-lg rounded-lg">
                    <p className="text-center text-black font-bold text-4xl pb-8">Thank you for registering!</p>
                    <p className="text-center text-black mt-2 text-lg">
                        A 6-digit verification code has been sent to your email: <strong>{registeredEmail}</strong>
                    </p>

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
                            ref={verifyCodeRef}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
