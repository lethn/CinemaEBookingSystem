import Link from "next/link";

export default function NavBar() {
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
                <li>
                    <Link href="/login" className="px-3 py-1 rounded hover:bg-stone-600">
                        Login
                    </Link>
                </li>
                <li>
                    <Link href="/register"
                          className="px-3 py-1 rounded hover:bg-stone-600">
                        Register
                    </Link>
                </li>
            </ul>
        </div>
    );
}
