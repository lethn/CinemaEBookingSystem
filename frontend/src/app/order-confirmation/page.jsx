"use client"
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import NavBar from "../components/navBar";

export default function OrderConfirmation() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        router.push("/");
    };

    return (
        <div>
            <NavBar/>
            <div className="flex justify-center items-center h-screen">
                <form className="bg-white p-8 shadow-lg w-80 rounded-lg" onSubmit={handleSubmit}>
                    <p className="text-center text-black">Your Order Has Been Purchased</p>
                    <p className="text-center text-black">placeholder purchase data</p>

                    <button type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                        Home
                    </button>
                </form>
            </div>
        </div>
    );
}