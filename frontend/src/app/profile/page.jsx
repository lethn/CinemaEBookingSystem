"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/user';
import NavBar from "../components/navBar";
import RestrictedPage from '../components/restrictedPage';
import axios from "axios";

export default function EditProfile() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [emailPromotions, setEmailPromotions] = useState(false); //idk if this is how we want this done but i am setting just so i can use it for now
    
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/customers/${userID}`);
            const userData = response.data;
            console.log(userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setCards(userData.paymentCards);
            setEmailPromotions(userData.subscribedToPromotions);
            setStreetAddress(userData.streetAddress);
            setCity(userData.city);
            setState(userData.state);
            setPostalCode(userData.postalCode);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const dummyCards = [
        {
            id: 1,
            friendlyName: "My Valid Card",
            cardNumber: "1000000000000000",
            expirationDate: "2014-01-01",
            billingAddress: "Main Street, Atlanta GA"
        }
    ];

    /*
    useEffect(() => {
        setCards(dummyCards);
    }, []);
    */

    const onClickEditProfileHandler = (e) => {
        e.preventDefault();
        //address = streetAddress+ " "+ city + " " + state + " " + postalCode; if we decide to add address to user
        axios.patch(`http://localhost:8080/customers/${userID}`,
            {
                "firstName": firstName,
                "lastName": lastName,
                //things to implement past here
                "subscribedToPromotions": emailPromotions, //we need a checkbox or something for this in the box
                "streetAddress": streetAddress,
                "city": city,
                "state": state,
                "postalCode": postalCode
            }).then((response) => {
                console.log(response.data);
                alert("Edit profile successfully!");
            }).catch((error) => {
                console.error('error: ', error);
                alert('error');
            });
    };

    const onClickChangePasswordHandler = (e) => {
        e.preventDefault();
        //check user enter right current password through auth?
        axios.post(`http://localhost:8080/login`,
            {
                "email": email,
                "password": currentPassword
            }).then((response) => {
                console.log(response.data);
                if (newPassword !== confirmPassword) {
                    setError('Passwords do not match');
                    alert("Passwords do not match");
                } else if (newPassword.length < 8) {
                    setError('Invalid password. Password must be at least 8 characters.');
                    alert('Password must be at least 8 characters');
                }
                else {
                    axios.patch(`http://localhost:8080/customers/${userID}`,
                        {
                            "password": newPassword
                        }).then((response) => {
                            console.log(response.data);
                            alert("Edit password successfully!");
                        }).catch((error) => {
                            console.error('error: ', error);
                            alert('Internal Server error.');
                        });
                }
            }).catch((error) => {
                console.error('error: ', error);
                alert('Current password failed to authenticate.');
            });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError('');
    }

    const onClickAddCardHandler = (e) => {
        e.preventDefault();
        const [month, year] = expirationDate.split('/');
        const fullYear = `20${year}`;
        const day = '01';
        const expDate = `${fullYear}-${month}-${day}`;
        axios.post(`http://localhost:8080/paymentCards?customerId=${userID}`,
            {
                "friendlyName": cardName,
                "cardNumber": cardNumber,
                "expirationDate": expDate, // expirationDate needs to be formatted to match db
                "billingAddress": "TO DO"
            }
        ).then((response) => {
            console.log(response.data);
            alert("Added card successfully!");
            fetchUserData();
        }).catch((error) => {
            console.log(error);
            alert("Error while adding card");
        });
    };

    const handleDeleteCard = (id) => {

        axios.delete(`http://localhost:8080/paymentCards/${id}`).then((response) => {
            console.log(response.data);
            alert("Card deleted successfully!");
        }).catch((error) => {
            console.log(error);
            alert("Error while deleting card");
        });

        setCards(cards.filter((card) => card.id !== id));
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

    if (isLoggedIn) {
        return (
            <div>
                <NavBar userType={userType} />

                <div className="flex flex-col justify-center items-center m-8 p-8">
                    <div className='grid grid-cols-2'>
                        <div className='p-4'>
                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickEditProfileHandler}>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">Edit Profile</h2>
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">
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
                                        <label className="text-lg font-medium mb-1">
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
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        required
                                        readOnly
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        value={streetAddress}
                                        onChange={(e) => setStreetAddress(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">State</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">Postal Code</label>
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
                                    <input
                                        type='checkbox'
                                        checked={emailPromotions}
                                        onChange={(e) => setEmailPromotions(e.target.checked)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <label className='font-medium mb-1'>Receive email promotions?</label>
                                </div>

                                <button type="submit" className="text-xl w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Save Profile
                                </button>
                            </form>

                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4" onSubmit={onClickChangePasswordHandler}>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">Change Password</h2>
                                {/* field for entering current password */}
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        //type = "text"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        required
                                    />
                                </div>

                                {/* field for entering new password */}
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        //type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        required
                                    />
                                </div>

                                {/* field for confirming new password */}
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        //type= "text"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        required
                                    />
                                </div>

                                <button type="submit" className="text-xl w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Reset Password
                                </button>
                            </form>
                        </div>

                        <div className='p-4'>

                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickAddCardHandler}>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">Manage Cards</h2>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Card Name</label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumber}
                                        className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                        maxLength={16}
                                        minLength={16}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">Expiration Date (MM/YY)</label>
                                        <input
                                            type="text"
                                            value={expirationDate}
                                            onChange={handleExpirationDate}
                                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                            maxLength={5}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">CVV</label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={handleCvv}
                                            className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                            maxLength={3}
                                            minLength={3}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="text-xl w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Add New Card
                                </button>
                            </form>

                            {/* display current cards, fetch from user data */}

                            <div className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4 text-lg font-medium mb-1 text-black">
                            <h2 className="text-4xl font-semibold mb-6 text-white">Current Cards</h2>
                                <table className="table-auto border min-w-full border-white">
                                    <thead>
                                        <tr>
                                            <th className="border p-2 text-lg font-medium mb-1 text-white">Card Name</th>
                                            {/* <th className="border p-2 text-lg font-medium mb-1 text-black">Card Number</th> */}
                                            <th className="border p-2 text-lg font-medium mb-1 text-white">Expiration</th>
                                            <th className=" p-2 text-lg font-medium mb-1 text-white">Delete Card</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cards.map((card) => (
                                            <tr key={card.id}>
                                                <td className="border p-2 text-white">{card.friendlyName}</td>
                                                {/* <td className="border p-2">{card.cardNumber}</td> */}
                                                <td className="border p-2 text-white">{card.expirationDate}</td>
                                                <td className="border p-2">
                                                    <button
                                                        onClick={() => handleDeleteCard(card.id)}
                                                        className="bg-red-600 text-white p-1 rounded hover:bg-red-800 transition duration-300 ease-in-out"
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

    return (
        <RestrictedPage heading1="You must be signed in to view this page" heading2="Please log in to proceed" />
    );
}
