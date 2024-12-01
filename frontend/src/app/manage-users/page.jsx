"use client"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingPage from "../components/loadingPage"
import Pagination from '../components/pagination';

export default function ManageUsers() {
    const router = useRouter();
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    // States for search term and users
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const changePageHandler = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/customers`);
            const customers = response.data;
            const newResponse = await axios.get(`http://localhost:8080/admins`);
            const admin = newResponse.data;
            const admins = admin.map(admin => ({
                ...admin,
                status: '',  // Blank status for all admins
            }));
            const newArray = [...customers, ...admins];
            setAllUsers(newArray);
            setUsers(newArray); // Set all users initially
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching users:', error);
            setAllUsers([]);
            setUsers([]); // Reset users on error
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users by search term
    const searchedUsers = allUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        setUsers(searchedUsers); // Set the users based on the search term
    };

    const handleEdit = (userId) => {
        router.push(`manage-users/edit-user/${userId}`);
    };

    const handleDelete = (userType, userId) => {
        if (userType === "ADMIN") {
            axios.delete(`http://localhost:8080/admins/${userId}`)
                .then(() => {
                    alert("Admin deleted successfully!");
                    // Remove the deleted user from the local state
                    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                })
                .catch((error) => {
                    console.error('Error deleting admin:', error);
                    alert('Error deleting user');
                });
        } else {
            axios.delete(`http://localhost:8080/customers/${userId}`)
                .then(() => {
                    alert("Customer deleted successfully!");
                    // Remove the deleted user from the local state
                    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                })
                .catch((error) => {
                    console.error('Error deleting customer:', error);
                    alert('Error deleting user');
                });
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar userType={userType} />
                <div className="flex flex-col flex-grow items-center justify-center m-2 mx-16">
                    <div className="bg-neutral-800/80 p-6 shadow-lg rounded-lg w-full">
                    <div className='flex justify-between'>
                        <h2 className="text-3xl font-semibold text-white mb-4 text-center">Manage Users</h2>
                        <div className="flex flex-box mb-4">
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-3 mx-2 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                            />
                            <button
                                className="font-semibold px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-800 transition duration-300 ease-in-out"
                                onClick={handleSearchSubmit}>Search</button>
                        </div>
                    </div>
                        <div className="grid grid-cols-[2fr_2fr_1fr_2fr_2fr] justify-center items-center gap-2 px-3 py-1 bg-neutral-700 text-white rounded-lg font-semibold md:grid mb-4">
                            <p className="p-3 text-lg text-center">Name</p>
                            <p className="p-3 text-lg text-center">Email</p>
                            <p className="p-3 text-lg text-center">ID</p>
                            <p className="p-3 text-lg text-center">Status</p>
                            <p className="p-3 text-lg text-center">Actions</p>
                        </div>
                        <div className="grid gap-4">
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <div key={user.id} className="grid grid-cols-[2fr_2fr_1fr_2fr_2fr] gap-2 p-3 text-white bg-neutral-700/50 rounded-lg hover:outline outline-1 outline-navBarRed">
                                        <div className="font-bold text-lg text-center">{user.firstName + " " + user.lastName}</div>
                                        <div className="text-center">{user.email}</div>
                                        <div className="text-center">{user.id}</div>
                                        <div className="text-center">{user.status + " " + user.userType}</div>
                                        <div className="flex gap-2 justify-center items-center">
                                            {user.userType !== "ADMIN" && (
                                                <button
                                                    className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 w-full md:w-auto transition duration-300 ease-in-out"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    View
                                                </button>
                                            )}
                                            <button
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-navBarRed hover:bg-red-800 w-full md:w-auto transition duration-300 ease-in-out"
                                                onClick={() => handleDelete(user.userType, user.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-white py-2">No users found</div>
                            )}
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChangePage={changePageHandler}
                        pagesPerRow={15}
                    />
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
