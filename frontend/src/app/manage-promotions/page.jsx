"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/user";
import NavBar from "../components/navBar";
import RestrictedPage from "../components/restrictedPage";
import LoadingPage from "../components/loadingPage";
import Pagination from "../components/Pagination";

export default function ManagePromotions() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    const [promotions, setPromotions] = useState([]);
    const [promotionCode, setPromotionCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Promotions Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const promotionsPerPage = 5;
    const indexOfLastPromotion = currentPage * promotionsPerPage;
    const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
    const currentPromotions = promotions.slice(indexOfFirstPromotion, indexOfLastPromotion);
    const totalPages = Math.ceil(promotions.length / promotionsPerPage);

    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/promotions");
            console.log(response.data);
            const reversedPromotions = response.data.reverse();
            setPromotions(reversedPromotions);
        } catch (error) {
            console.error("Error fetching promotions:", error);
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
            discount: parseFloat(discountPercentage),
        };

        try {
            const response = await axios.post("http://localhost:8080/promotions", newPromotion);
            setPromotions([response.data, ...promotions]);
            setPromotionCode("");
            setDiscountPercentage("");
            setCurrentPage(1);
        } catch (error) {
            console.error("Error adding promotion:", error);
        }
    };

    const handleSendPromotion = (id) => {
        try {
            axios.post(`http://localhost:8080/promotions/send-promotion?promotionId=${id}`);
            setPromotions(promotions.map((promotion) =>
                promotion.id === id ? { ...promotion, modifiable: false } : promotion
            ));
            alert("Promotion sent successfully");
        } catch (error) {
            console.error("Error sending promotion:", error);
            alert("Failed to send promotion");
        }
    };

    const handleDeletePromotion = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/promotions/${id}`);
            const updatedPromotions = promotions.filter((promotion) => promotion.id !== id);
            setPromotions(updatedPromotions);
            if (updatedPromotions.length > 0 && indexOfFirstPromotion >= updatedPromotions.length && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };

    const changePageHandler = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-lg font-medium mb-1">Discount Percentage <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>

                            <button type="submit" className="text-xl w-full bg-navBarRed text-white p-3 mt-2 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                Add Promotion
                            </button>
                        </form>
                    </div>

                    <div className="p-4 w-full lg:w-1/2">
                        <div className="bg-neutral-800/80 p-10 shadow-lg rounded-lg w-full min-w-[320px] lg:min-w-[600px] max-w-full overflow-x-auto">
                            <h2 className="text-4xl font-semibold mb-6 text-white">Promotion List</h2>
                            {currentPromotions.length === 0 ? (
                                <p className="text-center text-gray-400/70">No promotions available at the moment.</p>
                            ) : (
                                currentPromotions.map((promotion) => (
                                    <div
                                        key={promotion.id}
                                        className="flex flex-col sm:flex-row items-center p-4 rounded-lg mb-4 text-white bg-neutral-700/50 justify-between min-w-[300px] lg:min-w-[500px] max-w-full hover:bg-neutral-700"
                                    >
                                        <div className="flex-1 overflow-hidden mx-2">
                                            <h3 className="font-bold text-white text-2xl">
                                                {promotion.promoCode}
                                            </h3>
                                            <p className="text-white text-xl font-medium whitespace-nowrap">
                                                Discount: {promotion.discount}%
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 mx-2 sm:mt-0">
                                            <button
                                                className={`font-semibold px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out ${promotion.modifiable ? 'bg-green-600 hover:bg-green-800' : 'bg-gray-300 cursor-not-allowed'
                                                    }`}
                                                onClick={() => handleSendPromotion(promotion.id)}
                                                disabled={!promotion.modifiable}
                                            >
                                                Send
                                            </button>
                                            <button
                                                className={`font-semibold px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out ${promotion.modifiable ? 'bg-navBarRed hover:bg-red-800' : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                                onClick={() => handleDeletePromotion(promotion.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onChangePage={changePageHandler}
                            pagesPerRow={15}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <RestrictedPage heading1="You must be signed in as an admin to view this page" heading2="Please log in to proceed" />
    );
}
