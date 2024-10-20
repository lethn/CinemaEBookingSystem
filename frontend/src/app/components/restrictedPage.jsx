import React from 'react';
import NavBar from './navBar';

const RestrictedPage = (props) => {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col justify-center p-40 m-40">
                <h1 className="text-center text-4xl font-semibold text-white m-1 p-1">
                    {props.heading1}
                </h1>
                <h1 className="text-center text-4xl font-semibold text-white m-1 p-1">
                    {props.heading2}
                </h1>
            </div>
        </div>
    );
}

export default RestrictedPage;