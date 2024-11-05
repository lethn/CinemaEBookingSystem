"use client"
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/user';
import NavBar from '../components/navBar';
import RestrictedPage from '../components/restrictedPage';
import LoadingPage from '../components/loadingPage';

export default function ManagePromotions() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [promotions, setPromotions] = useState([]);
    const [promotionCode, setPromotionCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/promotions');
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleAddPromotion = async (e) => {
        e.preventDefault();
        const newPromotion = {
            promoCode: promotionCode,
            discount: parseFloat(discountPercentage)
        };

        try {
            const response = await axios.post('http://localhost:8080/promotions', newPromotion);
            setPromotions([...promotions, response.data]);
            setPromotionCode('');
            setDiscountPercentage('');
        } catch (error) {
            console.error('Error adding promotion:', error);
        }
    };

    const handleSendPromotion = (id) => {
        try {
            axios.post(`http://localhost:8080/promotions/send-promotion?promotionId=${id}`);
            setPromotions(promotions.map(promotion =>
                promotion.id === id ? { ...promotion, modifiable: false } : promotion
            ));
            alert('Promotion sent successfully');
        } catch (error) {
            console.error('Error sending promotion:', error);
            alert('Failed to send promotion');
        }
    };

    const handleDeletePromotion = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/promotions/${id}`);
            setPromotions(promotions.filter((promotion) => promotion.id !== id));
        } catch (error) {
            console.error('Error deleting promotion:', error);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isLoggedIn && userType === "ADMIN") {
        return (
            <div>
                <NavBar userType={userType} />

                <div className="flex justify-center m-8 p-8">
                    <div className="p-4">
                        <form className="bg-neutral-800/80 p-10 shadow-lg rounded-lg" onSubmit={handleAddPromotion}>
                            <h2 className="text-4xl font-semibold mb-6">Add Promotion</h2>
                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1">Promotion Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={promotionCode}
                                    onChange={(e) => setPromotionCode(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-lg text-black box-border focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1">Discount Percentage <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    className="w-full p-3 border border-gray-400 rounded-lg text-black box-border focus:outline-none"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>

                            <button type="submit" className="text-xl w-full bg-red-600 text-white p-3 mt-2 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                Add Promotion
                            </button>
                        </form>
                    </div>

                    <div className="p-4 w-full lg:w-1/2">
                        <div className="bg-neutral-800/80 p-10 shadow-lg rounded-lg w-full">
                            <h2 className="text-4xl font-semibold mb-6 text-white">Promotion List</h2>
                            {promotions.map((promotion) => (
                                <div key={promotion.id} className="flex p-4 m-auto rounded-lg mb-4 text-white bg-neutral-800 justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-2xl">
                                            {promotion.promoCode}
                                        </h3>
                                        <p className="text-white text-xl font-medium">
                                            Discount: {promotion.discount}%
                                        </p>
                                    </div>
                                    <div className="flex p-2">
                                        <button
                                            className={`font-semibold px-2 mx-2 rounded-lg text-white ${promotion.modifiable ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            onClick={() => handleSendPromotion(promotion.id)}
                                            disabled={!promotion.modifiable}
                                        >
                                            Send
                                        </button>
                                        <button
                                            className={`font-semibold px-2 mx-2 rounded-lg text-white ${promotion.modifiable ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            onClick={() => handleDeletePromotion(promotion.id)}
                                            disabled={!promotion.modifiable}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
