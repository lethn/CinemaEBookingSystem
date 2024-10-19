"use client";
import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/user';
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar";
import axios from "axios";

export default function Register() {
    const router = useRouter();
    const { setEmailForRegistration } = useContext(AuthContext);
    const passwordRef = useRef(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [emailPromotions, setEmailPromotions] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!((cardNumber.length == 16 && expirationDate.length == 5 && cvv.length == 3) ||
        (cardNumber.length == 0 && expirationDate.length == 0 && cvv.length == 0))) {
            alert('Card information is incorrect');
            return;
        }

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            alert('Passwords do not match');
            passwordRef.current.focus();
            return;
        }

        if (password.length < 8) {
            setPassword("");
            setConfirmPassword("");
            alert('Password must be at least 8 characters');
            passwordRef.current.focus();
            return;
        }

        axios.post(
            'http://localhost:8080/customers',
            {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password,
                "userType": "CUSTOMER"
            }
        ).then((response) => {
            console.log(response.data);
            setEmailForRegistration(email);
            router.push('/register-confirmation');
        }).catch((error) => {
            console.log(error);
            alert("Email is already associated with an account");
        });
    };

    const handleExpirationDate = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2); // Insert the slash after MM
        }
        if (value.length > 5) {
            value = value.slice(0, 5); // Limit input to MM/YY format
        }
        setExpirationDate(value);
    };

    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setCardNumber(value);
    };

    const handleCvv = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setCvv(value);
    };

    const handlePostalCode = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setPostalCode(value);
    };

    return (
        <div>
            <NavBar />
            <div className="flex flex-col justify-center items-center m-8 p-8">
                <h2 className="text-3xl font-semibold mb-6">Registration</h2>
                <form className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={handleSubmit}>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="font-medium mb-1 text-black">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium mb-1 text-black">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            ref={passwordRef}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium mb-1 text-black">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium mb-1 text-black">Street Address</label>
                        <input
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">State</label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">Postal Code</label>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={handlePostalCode}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                maxLength={5}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="font-medium mb-1 text-black">Payment Card Number</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumber}
                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            maxLength={16}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">Expiration Date (MM/YY)</label>
                            <input
                                type="text"
                                value={expirationDate}
                                onChange={handleExpirationDate}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-medium mb-1 text-black">CVV</label>
                            <input
                                type="text"
                                value={cvv}
                                onChange={handleCvv}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                maxLength={3}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <input 
                            type='checkbox'
                            value={emailPromotions}
                            onChange={(e) => setEmailPromotions(e.target.value)}
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label className='font-medium mb-1 text-black'>Recieve email promotions?</label>
                    </div>

                    <button type="submit" className="text-xl bg-red-800 text-white p-3 px-6 rounded-md hover:bg-red-900 w-full">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
