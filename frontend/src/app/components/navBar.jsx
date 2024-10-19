import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../contexts/user";
import { useRouter } from "next/navigation";

export default function NavBar({ userType }) {
    const { isLoggedIn, signOut } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        signOut();
        router.push("/");
    };

    return (
        <div className="bg-navBarRed">
            <ul className="flex justify-end items-center">
                <li className="mr-auto">
                    <Link href='/' className="text-white text-bold text-2xl hover:text-black px-3 transition duration-300 ease-in-out">
                        eCinema
                    </Link>
                </li>

                {!isLoggedIn && (
                    <>
                        <li>
                            <Link href="/login">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Login
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/register">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Register
                            </button>
                            </Link>
                        </li>
                    </>
                )}

                {isLoggedIn && userType === "CUSTOMER" && (
                    <>
                        <li>
                            <Link href="/profile">
                                <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                    Profile
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/order-history">
                                <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                    Order History
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {isLoggedIn && userType === "ADMIN" && (
                    <>
                        <li>
                            <Link href="/profile">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Profile
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-movies">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Manage Movies
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-promotions">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Manage Promotions
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-users">
                            <button className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Manage Users
                            </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-4 py-3 hover:bg-red-900 transition duration-300 ease-in-out">
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
