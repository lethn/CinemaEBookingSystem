"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/user';
import NavBar from "../../../components/navBar";
import RestrictedPage from '../../../components/restrictedPage';
import LoadingPage from '../../../components/loadingPage';
import axios from "axios";
import {useRouter} from "next/navigation";

export default function EditProfile({ params }) {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const { id } = params;
    const router = useRouter();
    //const [user,setUser]= useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [emailPromotions, setEmailPromotions] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    // Fetch user data based on id
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/customers/${id}`);
            setFields(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to fetch user data.');
        } finally {
            setIsLoading(false);
        }
    };

    const setFields = (user) =>{
        setFirstName(user.firstName);
        //console.log(firstName);
        setLastName(user.lastName);
        //console.log(lastName);
        setEmail(user.email);
        //console.log(email);
        setEmailPromotions(user.subscribedToPromotions);
        //console.log(emailPromotions);
        setStreetAddress(user.streetAddress);
        //console.log(streetAddress);
        setCity(user.city);
        //console.log(city);
        setState(user.state);
        //console.log(state);
        setPostalCode(user.postalCode);
        //console.log(postalCode);
        setStatus(user.status);
    };

    useEffect(() => {
        if (id) {
            fetchUserData();
        }else{
            alert("no id");
        }
    }, [id]);

    const onClickEditProfileHandler = (e) => {
        e.preventDefault();

        const updatedUser = {
            firstName,
            lastName,
            subscribedToPromotions: emailPromotions,
            streetAddress,
            city,
            state,
            postalCode
        };

        axios.patch(`http://localhost:8080/customers/${id}`, updatedUser)
            .then((response) => {
                console.log(response.data);
                alert("Profile updated successfully!");
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            });
    };

    const handlePostalCode = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        setPostalCode(value);
    };


    const onClickActivateHandler = (e) => {
        e.preventDefault();
        const suspendStatus ={
            status: "ACTIVE"
        };
        axios.patch(`http://localhost:8080/customers/${id}`, suspendStatus)
            .then((response) => {
                console.log(response.data);
                alert("Profile updated successfully!");
                setStatus('ACTIVE');
                //router.push('manage-users');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            });
    }

    const onClickSuspendHandler = (e) => {
        e.preventDefault();
        const suspendStatus ={
            status: "SUSPENDED"
        };
        axios.patch(`http://localhost:8080/customers/${id}`, suspendStatus)
            .then((response) => {
            console.log(response.data);
            alert("Profile updated successfully!");
                setStatus('SUSPENDED');
            //router.push('manage-users');
        })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            });
    }

    const onClickAdminHandler = (e) => {
        e.preventDefault();
        //console.log(id);
        axios.post(`http://localhost:8080/convert-customer-to-admin?customerId=${id}`)
            .then((response) => {
                console.log(response.data);
                alert("Admin created");
                router.push("/manage-users");
            })
            .catch((error) => {
                console.error('Error creating Admin:', error);
                alert('Error deleting profile');
            });
    }

    // Loading state
    if (isLoading) {
        return <LoadingPage />;
    }

    // Check if the user is logged in and has admin privileges
    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar userType={userType} />
                <div className="flex flex-col flex-grow justify-center items-center mx-16 my-4">
                    <div className='grid grid-cols-2 w-full'>
                        <div className='p-4'>
                            <form className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl">
                                    {error && <p className="text-red-500 mb-4">{error}</p>}
                                    <h2 className="text-4xl font-semibold mb-6">User Profile</h2>
                                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                        <div className="flex-1">
                                            <label className="text-lg font-medium mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                readOnly
                                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-lg font-medium mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                readOnly
                                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-lg font-medium mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            className="w-full p-3 rounded-lg text-white box-border bg-neutral-700/50 outline-1 outline-navBarRed focus:outline hover:outline"
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-lg font-medium mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            readOnly
                                            className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                        <div className="flex-1">
                                            <label className="text-lg font-medium mb-1">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                readOnly
                                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-lg font-medium mb-1">State</label>
                                            <input
                                                type="text"
                                                value={state}
                                                readOnly
                                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-lg font-medium mb-1">Postal Code</label>
                                            <input
                                                type="text"
                                                value={postalCode}
                                                readOnly
                                                className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed hover:outline focus:outline"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type='checkbox'
                                            checked={emailPromotions}
                                            readOnly
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                                        />
                                        <label className='font-medium mb-1'>Receive email promotions?</label>
                                    </div>
                                </form>

                        </div>
                        <div className='p-4'>
                            <div
                                className="flex flex-col bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl gap-3 justify-center items-center m-4">
                                <h2 className="text-4xl font-semibold mb-6 w-full">Change User Status</h2>
                                <div className='w-[90%]'>
                                    <button
                                        onClick={onClickAdminHandler}
                                        className="text-xl w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out mb-4"
                                    > Bestow Admin
                                    </button>
                                    <button
                                        onClick={status === ("SUSPENDED" || "INACTIVE") ? onClickActivateHandler : onClickSuspendHandler}
                                        className="text-xl w-full bg-navBarRed text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out"
                                    >
                                        {status === "INACTIVE"? "Activate User" :
                                            status === "SUSPENDED" ? "Unsuspend User" : "Suspend User"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in to view this page" heading2="Please log in to proceed"/>
    );
}
