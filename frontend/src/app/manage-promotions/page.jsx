"use client"
import { useState, useEffect } from "react";
import NavBar from "../components/navBar";

export default function ManagePromotions() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    return (
        <div>
            <NavBar userRole={userRole}/>
            <h1>Manage Promotions</h1>
            <table className="manage-table" cellPadding="10px">
                <thead>
                <tr>
                    <th>Promotion:</th>
                    <th>Code:</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Free movies</td>
                    <td>1234</td>
                    <td>
                        {/* Man idk how to do this button doesnt do anything */}
                        <input type="button" value="Delete"
                               className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700-700">
                        </input>
                    </td>
                </tr>
                </tbody>
            </table>
            <h1>Add Promotion</h1>
            <form className="shadow-lg w-80 rounded-lg">
                <input
                    type="text"
                    placeholder="Promotion"
                    className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                    required
                /> <br/>
                <input
                    type="text"
                    placeholder="Code"
                    className="block w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                    required
                /> <br/>
                {/*This button also does nothing also this form could be a component? sorry i dont know how this works*/}
                <button type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                    ADD
                </button>
            </form>
        </div>
    );
}

