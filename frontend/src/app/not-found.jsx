import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div>
            <div className="flex flex-col justify-center p-40 m-40">
                <h1 className="text-center text-4xl font-semibold text-white m-1 p-1">
                    404 Error |  This page could not be found
                </h1>
                <div className="flex justify-center m-4 p-4">
                    <Link href="/" className="bg-red-600 text-white text-xl px-6 py-4 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                        Return to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
