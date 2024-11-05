import React from 'react';
import NavBar from './navBar';

const LoadingPage = () => {
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    return (
        <div>
            <NavBar userType={userType} />
            <div className="flex justify-center items-center p-40 m-40">
                <h1 className="text-center text-4xl font-semibold text-white">
                    Loading...
                </h1>
            </div>
        </div>
    );
}

export default LoadingPage;
