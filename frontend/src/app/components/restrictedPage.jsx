import React from 'react';
import NavBar from './navBar';

const RestrictedPage = (props) => {
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    return (
        <div className='flex flex-col h-screen'>
            <NavBar userType={userType} />
            <div className="flex flex-col h-full justify-center items-center">
                <h1 className="text-center text-4xl font-semibold text-white m-2">
                    {props.heading1}
                </h1>
                <h1 className="text-center text-3xl font-semibold text-white m-2">
                    {props.heading2}
                </h1>
            </div>
        </div>
    );
}

export default RestrictedPage;