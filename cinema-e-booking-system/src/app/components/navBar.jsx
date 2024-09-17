import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    return (
        <div className="bg-dark-red border-2 border-dark-red py-2 px-4">
            <ul className="flex justify-end space-x-4">
                <li className="mr-auto">
                    Logo
                </li>
                <li>
                    <Link href="/" className="text-black border border-black px-3 py-1 rounded hover:bg-gray-200">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/login" className="text-black border border-black px-3 py-1 rounded hover:bg-gray-200">
                        Login
                    </Link>
                </li>
                <li>
                    <Link href="/register" className="text-black border border-black px-3 py-1 rounded hover:bg-gray-200">
                        Register
                    </Link>
                </li>
            </ul>
        </div>
    );
}
