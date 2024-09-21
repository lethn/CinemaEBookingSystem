import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar({ userRole }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (userRole) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem('userRole'); // Clear the stored role
        window.location.href = '/'; // Redirect to home or refresh page
    };

    return (
        <div className="bg-black py-2 px-4">
            <ul className="flex justify-end items-center space-x-4">
                <li className="mr-auto">
                    <label className="text-white text-2xl">
                        eCinema
                    </label>
                </li>

                <li>
                    <Link href="/" className="px-3 py-1 rounded hover:bg-stone-600">
                        Home
                    </Link>
                </li>

                {!isLoggedIn && (
                    <>
                        <li>
                            <Link href="/login" className="px-3 py-1 rounded hover:bg-stone-600">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="px-3 py-1 rounded hover:bg-stone-600">
                                Register
                            </Link>
                        </li>
                    </>
                )}

                {isLoggedIn && userRole === "user" && (
                    <>
                        <li>
                            <Link href="/profile" className="px-3 py-1 rounded hover:bg-stone-600">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/order-history" className="px-3 py-1 rounded hover:bg-stone-600">
                                Order History
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-3 py-1 rounded hover:bg-stone-600">
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {isLoggedIn && userRole === "admin" && (
                    <>
                        <li>
                            <Link href="/profile" className="px-3 py-1 rounded hover:bg-stone-600">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-movies" className="px-3 py-1 rounded hover:bg-stone-600">
                                Manage Movies
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-promotions" className="px-3 py-1 rounded hover:bg-stone-600">
                                Manage Promotions
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-users" className="px-3 py-1 rounded hover:bg-stone-600">
                                Manage Users
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-3 py-1 rounded hover:bg-stone-600">
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
