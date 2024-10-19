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
        <div className="bg-red-900">
            <ul className="flex justify-end items-center">
                <li className="mr-auto">
                    <Link href='/' className="text-white text-2xl hover:text-red-950 px-3">
                        eCinema
                    </Link>
                </li>

                {!isLoggedIn && (
                    <>
                        <li>
                            <Link href="/login">
                            <button className="px-4 py-3 hover:bg-red-950">
                                Login
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/register">
                            <button className="px-4 py-3 hover:bg-red-950">
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
                                <button className="px-4 py-3 hover:bg-red-950">
                                    Profile
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/order-history">
                                <button className="px-4 py-3 hover:bg-red-950">
                                    Order History
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-4 py-3 hover:bg-red-950">
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {isLoggedIn && userType === "ADMIN" && (
                    <>
                        <li>
                            <Link href="/profile">
                            <button className="px-4 py-3 hover:bg-red-950">
                                Profile
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-movies">
                            <button className="px-4 py-3 hover:bg-red-950">
                                Manage Movies
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-promotions">
                            <button className="px-4 py-3 hover:bg-red-950">
                                Manage Promotions
                            </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/manage-users">
                            <button className="px-4 py-3 hover:bg-red-950">
                                Manage Users
                            </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="px-4 py-3 hover:bg-red-950">
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
