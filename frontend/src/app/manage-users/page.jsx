"use client"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ManageUsers() {
    const router = useRouter();
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    // States for search term and users
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

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
        } catch (error) {
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

    // Loading spinner or message if users are still being fetched
    if (!isLoggedIn || userType !== "ADMIN") {
        return (
            <RestrictedPage
                heading1="You must be signed in as an admin to view this page"
                heading2="Please log in to proceed"
            />
        );
    }

    return (
        <div className="m-1.5 gap-3">
            <NavBar userType={userType} />
            <h1 className="text-3xl font-semibold text-center text-white m-2 p-2">
                Manage Users
            </h1>
            <div className="flex flex-col items-center justify-center w-full gap-5">
                <div className="flex flex-box gap-2 w-fit p-1 text-black">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="text-black bg-white placeholder-grey-200 px-4 py-2 rounded-md shadow-sm"
                    />
                    <button
                        className="font-semibold px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-800"
                        onClick={handleSearchSubmit}>Search</button>
                </div>
                <div className="flex w-full justify-center">
                    <table className="min-w-full table-fixed bg-blue-950 border border-gray-200 shadow-lg rounded-md">
                        <thead className="bg-black">
                        <tr className="px-4 py-2 text-center text-sm font-semibold text-white">
                            <th className="text-center w-1/5">Name</th>
                            <th className="text-center w-1/5">Email</th>
                            <th className="text-center w-1/5">ID</th>
                            <th className="text-center w-1/5">Status</th>
                            <th className="text-center w-1/5">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-800">
                                    <td className="text-center text-white px-4 py-2">{user.firstName + " " + user.lastName}</td>
                                    <td className="text-center text-white px-4 py-2">{user.email}</td>
                                    <td className="text-center text-white px-4 py-2">{user.id}</td>
                                    <td className="text-center text-white px-4 py-2">{user.status + " " + user.userType}</td>
                                    <td className="flex flex-box gap-2 justify-center items-center px-4 py-2">
                                        {user.userType !== "ADMIN" && (
                                            <button
                                                className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-800 w-full md:w-auto"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="font-semibold text-center px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-800 w-full md:w-auto"
                                            onClick={() => handleDelete(user.userType, user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center text-white py-2">No users found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
