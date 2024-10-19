"use client";
import { useState, useEffect } from 'react';
import NavBar from "../components/navBar";

export default function EditProfile() {
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');

    const dunnyCards = [
        {
            id: 1,
            friendlyName: "My Valid Card",
            cardNumber: "1000000000000000",
            expirationDate: "2014-01-01",
            billingAddress: "Main Street, Atlanta GA"
        }
    ];

    useEffect(() => {
        setCards(dunnyCards);
    }, []);

    const onClickEditProfileHandler = () => {
        alert("Edit profile successfully!");
    };

    const onClickChangePasswordHandler = () => {

        // check user's current password

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            alert("Passwords do not match");
        }

        setError('');
    }

    const onClickAddCardHandler = () => {
        alert("Add card successfully!");
    };

    const handleDeleteCard = (id) => {

        // TO DO: remove card from DB and user

        setPromotions(cards.filter((card) => card.id !== id));
    };

    return (
        <div>
            <NavBar userType={userType} />
            
            <div className="flex flex-col justify-center items-center m-8 p-8">
                <div className='grid grid-cols-2'>
                    <div className='p-4'>
                        <h2 className="text-4xl font-semibold mb-6">Edit Profile</h2>
                        <form className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickEditProfileHandler}>
                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">
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
                                    <label className="text-lg font-medium mb-1 text-black">
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
                                    <label className="text-lg font-medium mb-1 text-black">
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
                                <label className="text-lg font-medium mb-1 text-black">
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
                                <label className="text-lg font-medium mb-1 text-black">Street Address</label>
                                <input
                                    type="text"
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">City</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">State</label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">Postal Code</label>
                                    <input
                                        type="text"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="text-xl bg-blue-600 text-white p-3 px-6 rounded-md hover:bg-blue-700 w-full">
                                Save Profile
                            </button>
                        </form>

                        <form className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4" onSubmit={onClickChangePasswordHandler}>
                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            {/* field for entering current password */}
                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1 text-black">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    required
                                />
                            </div>

                            {/* field for entering new password */}
                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1 text-black">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    required
                                />
                            </div>

                            {/* field for confirming new password */}
                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1 text-black">
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    required
                                />
                            </div>

                            <button type="submit" className="text-xl bg-blue-600 text-white p-3 px-6 rounded-md hover:bg-blue-700 w-full">
                                Reset Password
                            </button>
                        </form>
                    </div>

                    <div className='p-4'>
                        <h2 className="text-4xl font-semibold mb-6">Manage Cards</h2>
                        <form className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickAddCardHandler}>
                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1 text-black">Card Number</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">Expiration Date (MM/YY)</label>
                                    <input
                                        type="text"
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-lg font-medium mb-1 text-black">CVV</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="text-xl bg-blue-600 text-white p-3 px-6 rounded-md hover:bg-blue-700 w-full">
                                Add New Card
                            </button>
                        </form>

                        {/* display current cards, fetch from user data */}

                        <div className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4 text-lg font-medium mb-1 text-black">
                            <h1>Current Cards</h1>

                            <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="border p-2 text-lg font-medium mb-1 text-black">Card Name</th>
                                    <th className="border p-2 text-lg font-medium mb-1 text-black">Card Number</th>
                                    <th className="border p-2 text-lg font-medium mb-1 text-black">Expiration</th>
                                </tr>
                            </thead>
                            <tbody>
                            {cards.map((card) => (
                                <tr key={card.id}>
                                <td className="border p-2">{card.friendlyName}</td>
                                <td className="border p-2">{card.cardNumber}</td>
                                <td className="border p-2">{card.expirationDate}</td>
                                <td className="border p-2">
                                    <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                    >
                                    Delete
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
