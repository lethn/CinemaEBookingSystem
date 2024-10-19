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

                {isLoggedIn && userType === "CUSTOMER" && (
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

                {isLoggedIn && userType === "ADMIN" && (
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
