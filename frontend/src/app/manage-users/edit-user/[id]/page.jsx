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
            <div>
                <NavBar userType={userType} />
                <div className="flex flex-col justify-center items-center m-8 p-8">
                    <div className='grid grid-cols-2 w-full'>
                        <div className='p-4'>
                            <div className="bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-4xl">
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <h2 className="text-4xl font-semibold mb-6">User Profile</h2>

                                {/* First Name and Last Name */}
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">
                                            First Name
                                        </label>
                                        <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                            {firstName}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">
                                            Last Name
                                        </label>
                                        <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                            {lastName}
                                        </p>
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">
                                        Email
                                    </label>
                                    <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                        {email}
                                    </p>
                                </div>

                                {/* Street Address */}
                                <div className="mb-4">
                                    <label className="text-lg font-medium mb-1">Street Address</label>
                                    <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                        {streetAddress ? streetAddress : "N/A"}
                                    </p>
                                </div>

                                {/* City, State, Postal Code */}
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">City</label>
                                        <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                            {city ? city : "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">State</label>
                                        <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                            {state ? state : "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-lg font-medium mb-1">Postal Code</label>
                                        <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                            {postalCode ? postalCode : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className='font-medium mb-1'>Receives email promotions?</label>
                                    <p className="font-normal w-full p-3 border border-gray-400 rounded-lg box-border bg-white text-black focus:outline-none ">
                                        {emailPromotions? "Yes":"No"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='p-4'>
                        <div
                            className="flex flex-col bg-neutral-800/80 p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl gap-3 justify-center items-center">
                            <h2 className="text-2xl font-semibold mb-2">Change User Status</h2>
                            <button
                                onClick={status === ("SUSPENDED" || "INACTIVE") ? onClickActivateHandler : onClickSuspendHandler}
                                className="text-xl w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-800 transition duration-300 ease-in-out"
                            >
                                {status === "INACTIVE"? "Activate User" :
                                    status === "SUSPENDED" ? "Unsuspend User" : "Suspend User"}
                            </button>
                            <h2 className="text-2xl font-semibold mb-2">Make User Admin</h2>
                            <button
                                onClick={onClickAdminHandler}
                                className="text-xl w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out"
                            > Bestow Admin
                            </button>
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
