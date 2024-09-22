"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar";

export default function OrderSummary() {
    const [userRole, setUserRole] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

    const [tickets, setTickets] = useState([
        { id: 1, seat: 'A1', price: 12 },
        { id: 2, seat: 'A2', price: 12 },
        { id: 3, seat: 'B1', price: 12 },
    ]);

    const handleDeleteTicket = (id) => {
        setTickets(tickets.filter(ticket => ticket.id !== id));
    };

    const onClickAddCardHandler = () => {
        event.preventDefault();
        router.push('/order-confirmation')
    };

    const addTicketsHandler = () => {
        router.push('/select-tickets');
    }

    const totalCost = tickets.reduce((total, ticket) => total + ticket.price, 0);
    const taxRate = 0.1; // 10% tax
    const tax = totalCost * taxRate;
    const finalTotal = totalCost + tax;

    return (
        <div>
            <NavBar userRole={userRole} />
            <div className="p-4">
                <h1 className="text-3xl font-bold my-2">Order Summary for Movie: Inception</h1>
                <div className="grid grid-cols-3">
                    <table className="w-full border mt-4">
                        <thead>
                        <tr>
                            <th className="border p-2">Seat Number</th>
                            <th className="border p-2">Price per Ticket</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                            <td className="border p-2">{ticket.seat}</td>
                            <td className="border p-2">${ticket.price}</td>
                            <td className="border p-2">
                                <button
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="bg-red-500 text-white p-1 rounded"
                                >
                                Delete
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-center p-4">
                        <h2 className="text-xl font-semibold">Order Summary:</h2>
                        <ul className="grid grid-cols-1 gap-4 mt-2">
                        {tickets.map((ticket) => (
                        <li key={ticket.id} className="flex justify-between p-2 border-b">
                            <span>Seat: {ticket.seat}</span>
                            <span>Price: ${ticket.price}</span>
                        </li>
                        ))}
                        </ul>
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                            <p>Total Cost:</p>
                            <p>${totalCost.toFixed(2)}</p>
                            <p>Tax (10%):</p>
                            <p>${tax.toFixed(2)}</p>
                            <h2 className="font-semibold">Final Total:</h2>
                            <h2 className="font-semibold">${finalTotal.toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    <form className="bg-white p-10 m-auto shadow-lg rounded-lg w-full max-w-3xl" onSubmit={onClickAddCardHandler}>
                            {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="mb-4">
                            <label className="text-lg font-medium mb-1 text-black">Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                            <div className="flex-1">
                                <label className="text-lg font-medium mb-1 text-black">Expiration Date (MM/YY)</label>
                                <input
                                    type="text"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-lg font-medium mb-1 text-black">CVV</label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-md text-black box-border"
                                />
                            </div>
                        </div>

                        <button type="submit" className="text-xl bg-blue-600 text-white p-3 px-6 rounded-md hover:bg-blue-700 w-full">
                            Pay Now
                        </button>
                    </form>
                </div>
                <button 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mt-5" 
                    onClick={addTicketsHandler}>Add Tickets</button>
            </div>
        </div>
    );
}