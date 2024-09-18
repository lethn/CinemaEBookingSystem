import Link from "next/link";

export default function NavBarAdmin() {
    return (
        <div className="bg-black py-2 px-4">
            <ul className="flex justify-end items-center space-x-4">
                <li className="mr-auto">
                    <label className="text-white text-2xl">
                        eCinema
                    </label>
                </li>
                <li>
                    <Link href="/admin" className="px-3 py-1 rounded hover:bg-stone-600">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/manage-movies" className="px-3 py-1 rounded hover:bg-stone-600">
                        Manage Movies
                    </Link>
                </li>
                <li>
                    <Link href="/manage-promos"
                          className="px-3 py-1 rounded hover:bg-stone-600">
                        Manage Promos
                    </Link>
                </li>
                <li>
                    <Link href=""
                          className="px-3 py-1 rounded hover:bg-stone-600">
                        Manage Users
                    </Link>
                </li>
                <li>
                    <Link href="/"
                          className="px-3 py-1 rounded hover:bg-stone-600">
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
}
