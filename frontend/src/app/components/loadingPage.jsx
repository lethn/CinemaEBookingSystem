import React from 'react';

const LoadingPage = () => {

    return (
        //removed navbar as it shows the user as logged out while loading
        <div className="flex h-screen justify-center items-center">
            <h1 className="text-center text-2xl font-semibold text-white">
                Loading...
            </h1>
        </div>
    );
}

export default LoadingPage;
