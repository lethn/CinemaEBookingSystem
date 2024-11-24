"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/user';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NavBar from "../components/navBar";
import RestrictedPage from '../components/restrictedPage';
import LoadingPage from '../components/loadingPage';
import axios from "axios";

export default function EditProfile() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            let url = "";
            if (userType === "ADMIN") {
                url = `http://localhost:8080/admins/${userID}`
            } else if (userType === "CUSTOMER") {
                url = `http://localhost:8080/customers/${userID}`;
            }

            const response = await axios.get(url);
            const userData = response.data;
            console.log(userData);

            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);

            if (userType === "CUSTOMER") {
                setCards(userData.paymentCards);
                setEmailPromotions(userData.subscribedToPromotions);
                setStreetAddress(userData.streetAddress);
                setCity(userData.city);
                setState(userData.state);
                setPostalCode(userData.postalCode);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchUserData();
    }, []);

    // const dummyCards = [
    //     {
    //         id: 1,
    //         friendlyName: "My Valid Card",
    //         cardNumber: "1000000000000000",
    //         expirationDate: "2014-01-01",
    //         billingAddress: "Main Street, Atlanta GA"
    //     }
    // ];

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

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div className='flex flex-col h-screen'>
                <NavBar userType={userType} />
                <div className="flex flex-col flex-grow justify-center items-center">
                    <div>
                        <form className="bg-neutral-800/80 p-8 m-auto shadow-lg rounded-lg w-full max-w-3xl">
                            <h2 className="text-4xl font-semibold mb-6">Admin Profile</h2>
                            <div className='w-4/5 mx-auto'>
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white focus:outline-none"
                                        readOnly
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white focus:outline-none"
                                        readOnly
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white focus:outline-none"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoggedIn && userType === "CUSTOMER") {
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
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
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
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
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
                                        className="w-full p-3 rounded-lg text-white box-border bg-neutral-700/50 focus:outline-none cursor-not-allowed"
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
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">State</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={handlePostalCode}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
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

                                <button type="submit" className="text-xl w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Save Profile
                                </button>
                            </form>

                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4" onSubmit={onClickChangePasswordHandler}>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">Change Password</h2>

                                {/* field for entering current password */}
                                <div className="mb-4 relative">
                                    <label className="text-lg font-medium mb-1">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-3 pr-10 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            required
                                        />
                                        <div
                                            onClick={toggleCurrentPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        >
                                            {showCurrentPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                                        </div>
                                    </div>
                                </div>

                                {/* field for entering new password */}
                                <div className="mb-4 relative">
                                    <label className="text-lg font-medium mb-1">
                                        New Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full p-3 pr-10 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            required
                                        />
                                        <div
                                            onClick={toggleNewPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        >
                                            {showNewPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                                        </div>
                                    </div>
                                </div>

                                {/* field for confirming new password */}
                                <div className="mb-6 relative">
                                    <label className="text-lg font-medium mb-1">
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-3 pr-10 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            required
                                        />
                                        <div
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="text-xl w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Reset Password
                                </button>
                            </form>
                        </div>

                        <div className='p-4'>

                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickAddCardHandler}>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">Manage Cards</h2>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Card Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Card Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumber}
                                        className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                        maxLength={16}
                                        minLength={16}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">
                                            Expiration Date (MM/YY) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={expirationDate}
                                            onChange={handleExpirationDate}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            maxLength={5}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">
                                            CVV <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={handleCvv}
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                            maxLength={3}
                                            minLength={3}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="text-xl w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                    Add New Card
                                </button>
                            </form>

                            {/* display current cards, fetch from user data */}

                            <div className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl mt-4 text-lg font-medium mb-1 text-black">
                                <h2 className="text-4xl font-semibold mb-6 text-white">Current Cards</h2>
                                <div className="grid grid-cols-3 justify-center items-center gap-2 px-3 py-1 bg-neutral-700 text-white rounded-lg font-semibold hidden md:grid mb-4">
                                    <p className="p-3 text-lg text-center">Card Name</p>
                                    <p className="p-3 text-lg text-center">Expiration</p>
                                    <p className="p-3 text-lg text-center">Delete Card</p>
                                </div>
                                {cards.map((card) => (
                                    <div key={card.id} className="grid grid-cols-3 justify-center items-center p-3 text-white bg-neutral-700/50 rounded-lg mb-4 hover:outline outline-1 outline-navBarRed">
                                        <p className="text-lg text-center">{card.friendlyName}</p>
                                        <p className="text-lg text-center">{card.expirationDate}</p>
                                        <div className='mx-auto'>
                                            <button
                                                onClick={() => handleDeleteCard(card.id)}
                                                className="font-semibold text-center px-4 py-1 rounded-lg text-white bg-navBarRed hover:bg-red-800 md:w-auto transition duration-300 ease-in-out w-min"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
