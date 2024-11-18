"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/user';
import axios from 'axios';
import NavBar from "../components/navBar";
import RestrictedPage from '../components/restrictedPage';
import LoadingPage from "../components/loadingPage";

export default function OrderSummary() {
    const { isLoggedIn } = useContext(AuthContext);
    const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [childTickets, setChildTickets] = useState(null);
    const [adultTickets, setAdultTickets] = useState(null);
    const [seniorTickets, setSeniorTickets] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const [movie, setMovie] = useState(null);
    const [showId, setShowId] = useState(null);
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState(null);
    const [promoCode, setPromoCode] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [cards, setCards] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [tickets, setTickets] = useState(null);
    const childTicketPrice = 8.00;
    const adultTicketPrice = 12.00;
    const seniorTicketPrice = 10.00;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const childTicketsParam = queryParams.get('childTickets');
            const adultTicketsParam = queryParams.get('adultTickets');
            const seniorTicketsParam = queryParams.get('seniorTickets');
            const movieIdParam = queryParams.get('movieId');
            const showIdParam = queryParams.get('id');
            const selectedSeatsParam = queryParams.get('sortedSeats');
            
            if (selectedSeatsParam) {
                setChildTickets(childTicketsParam);
                setAdultTickets(adultTicketsParam);
                setSeniorTickets(seniorTicketsParam);
                setMovieId(movieIdParam);
                setShowId(showIdParam);
                setSelectedSeats(selectedSeatsParam.split(','));
            }
        }
    }, []);

    useEffect(() => {
        if (movieId) {
            setIsLoading(true);
            axios.get(`http://localhost:8080/movies/${movieId}`)
                .then((response) => {
                    setMovie(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching movie data:", error);
                });
        }
        if (showId) {
            axios.get(`http://localhost:8080/shows/${showId}`)
                .then((response) => {
                    setShow(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching show data:", error);
                    setIsLoading(false);
                });
        }
    }, [movieId, showId]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/customers/${userID}`);
                const userData = response.data;
                console.log(userData);
                setCards(userData.paymentCards);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    useEffect(() => {
        if (!selectedSeats || !adultTickets || !seniorTickets || !childTickets) return;
    
        const ticketArray = [];
        const seatTypes = [
            { count: parseInt(adultTickets), type: "ADULT" },
            { count: parseInt(seniorTickets), type: "SENIOR" },
            { count: parseInt(childTickets), type: "CHILD" },
        ];
        let seatIndex = 0;
    
        seatTypes.forEach(({ count, type }) => {
            for (let i = 0; i < count; i++) {
                if (seatIndex < selectedSeats.length) {
                    ticketArray.push({
                        type,
                        seatId: selectedSeats[seatIndex],
                    });
                    seatIndex++;
                }
            }
        });
    
        setTickets(ticketArray);
    }, [adultTickets, seniorTickets, childTickets, selectedSeats]);

    useEffect(() => {
        console.log(tickets);
    }, [tickets])

    const handlePromoCodeValidation = async (event) => {
        event.preventDefault();
        const enteredPromoCode = event.target.promoCode.value.trim();
    
        if (!enteredPromoCode) {
            alert("Please enter a promo code.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/promotions/validate/${enteredPromoCode}`);
            if (response.ok) {
                const data = await response.json();
                setDiscount(data.discount);
                alert(`Promo code applied!`);
                setPromoCode(enteredPromoCode);
            } else {
                alert("Promo code does not exist.");
            }
        } catch (error) {
            console.error("Error validating promo code:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const editTickets = (e) => {
        router.push(`/select-tickets/${movieId}`)
    };

    const editSeats = (e) => {
        e.preventDefault();

        const queryString = new URLSearchParams({
            movieId,
            childTickets,
            adultTickets,
            seniorTickets
        }).toString();

        router.push(`/select-seats/${showId}?${queryString}`);
    };

    const deleteTicket = (type) => { 
        let updatedChildTickets = childTickets;
        let updatedAdultTickets = adultTickets;
        let updatedSeniorTickets = seniorTickets;
    
        if (type === 'child' && updatedChildTickets > 0) {
            updatedChildTickets -= 1;
        } else if (type === 'adult' && updatedAdultTickets > 0) {
            updatedAdultTickets -= 1;
        } else if (type === 'senior' && updatedSeniorTickets > 0) {
            updatedSeniorTickets -= 1;
        }
    
        if (updatedChildTickets + updatedAdultTickets + updatedSeniorTickets > 0) {
            const queryString = new URLSearchParams({
                movieId,
                childTickets: updatedChildTickets,
                adultTickets: updatedAdultTickets,
                seniorTickets: updatedSeniorTickets
            }).toString();
            router.push(`/select-seats/${showId}?${queryString}`);
        } else {
            alert('You must have at least one ticket');
        }
    };

    const handleExpirationDate = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2); // Insert the slash after MM
        }
        if (value.length > 5) {
            value = value.slice(0, 5); // Limit input to MM/YY format
        }
        setExpirationDate(value);
    };

    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setCardNumber(value);
    };

    const handleCvv = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setCvv(value);
    };

    const handleCardSelection = (cardId) => {
        setSelectedCard(cardId);
    };

    const handleBookingSubmission = async () => {
        try {
            let paymentCardId = selectedCard;
    
            if (!selectedCard) {
                alert("Please select a payment card.");
                return;
            }
    
            // If the user selects "new", create a new card first
            if (selectedCard === "new") {
                if ((cvv.length < 3) || (cardNumber.length < 16) || (expirationDate.length < 5)) {
                    alert('Fill out card details');
                    return;
                } else {
                    const [month, year] = expirationDate.split('/');
                    const fullYear = `20${year}`;
                    const day = '01';
                    const expDate = `${fullYear}-${month}-${day}`;
        
                    const cardResponse = await axios.post(`http://localhost:8080/paymentCards`, {
                        friendlyName: "temp",
                        cardNumber,
                        expirationDate: expDate,
                        billingAddress: "TO DO",
                    });
        
                    console.log("New card created:", cardResponse.data);
                    paymentCardId = cardResponse.data.id;
                }
            }
    
            // Proceed with booking after card creation
            const url = promoCode
                ? `http://localhost:8080/bookings?customerId=${userID}&showId=${showId}&paymentCardId=${paymentCardId}&promoCode=${promoCode}`
                : `http://localhost:8080/bookings?customerId=${userID}&showId=${showId}&paymentCardId=${paymentCardId}`;
    
            const bookingResponse = await axios.post(url, { tickets });
            console.log("Booking details:", bookingResponse.data);
            router.push(`/order-confirmation/${bookingResponse.data.id}`);
        } catch (error) {
            console.error("Error during submission:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (isLoading) {
        return(
            <LoadingPage />
        )
    }

    if (isLoggedIn && userType === "CUSTOMER") {
        return (
            <div className="flex flex-col min-h-screen">
                <NavBar userType={userType} />
                <div className="grid grid-cols-[2fr_1fr] flex-grow">
                    <div className="grid grid-cols-[4fr_5fr] p-4">
                        <div className="flex flex-col bg-navBarRed mr-4 rounded-xl h-full border-navBarRed border-2">
                            <img 
                                src={movie?.picture} 
                                alt="Poster" 
                                className="rounded-t-xl w-full object-cover h-1 items-top object-top flex-grow" 
                            />
                            <div className="p-4 pb-8 mb-4 bg-neutral-800/80 rounded-b-xl">
                                <div className="flex w-full justify-between mb-1">
                                    <h2 className="text-2xl text-white font-bold">{movie?.title}</h2>
                                    <p className="text-white border-2 border-white flex items-center justify-center px-1">{movie?.rating}</p>
                                </div>
                                <h2 className="text-xl text-white font-bold mb-1">
                                    {new Date(show.time).toLocaleString([], {
                                        weekday: 'long', 
                                        month: 'short', 
                                        day: '2-digit', 
                                        hour: "numeric", 
                                        minute: '2-digit'
                                    })}
                                </h2>
                                <p className="text-lg">Seats: {selectedSeats.join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center h-full">
                            <h2 className="text-4xl font-semibold w-full mb-4">Total Price</h2>
                            <div className="text-lg w-2/3 flex-grow flex flex-col justify-center mb-16">
                                {Array.from({ length: childTickets }, (_, index) => (
                                    <button onClick={() => deleteTicket('child')} key={index} className="flex justify-between w-full pb-1 relative hover:after:content-[''] hover:after:block hover:after:absolute hover:after:top-1/2 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white">
                                        <p>Child Ticket: </p>
                                        <p>${childTicketPrice.toFixed(2)}</p>
                                    </button>
                                ))}
                                {Array.from({ length: adultTickets }, (_, index) => (
                                    <button onClick={() => deleteTicket('adult')} key={index} className="flex justify-between w-full pb-1 relative hover:after:content-[''] hover:after:block hover:after:absolute hover:after:top-1/2 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white">
                                        <p>Adult Ticket: </p>
                                        <p>${adultTicketPrice.toFixed(2)}</p>
                                    </button>
                                ))}
                                {Array.from({ length: seniorTickets }, (_, index) => (
                                    <button onClick={() => deleteTicket('senior')} key={index} className="flex justify-between w-full pb-1 relative hover:after:content-[''] hover:after:block hover:after:absolute hover:after:top-1/2 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white">
                                        <p>Senior Ticket: </p>
                                        <p>${seniorTicketPrice.toFixed(2)}</p>
                                    </button>
                                ))}
                                <div className="flex justify-between border-t-2 py-1 text-xl font-bold">
                                    <p>Subtotal: </p>
                                    <p>${(childTickets * childTicketPrice + adultTickets * adultTicketPrice + seniorTickets * seniorTicketPrice).toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <p>Discount Applied: </p>
                                    <p>-{discount}%</p>
                                </div>
                                <div className="flex justify-between border-t-2 py-1 text-2xl font-bold">
                                    <p>Total: </p>
                                    <p>${((childTickets * childTicketPrice + adultTickets * adultTicketPrice + seniorTickets * seniorTicketPrice) * (1 - (discount / 100))).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center w-2/3">
                                <form onSubmit={handlePromoCodeValidation} className="my-1 flex w-full">
                                    <input
                                        type="text"
                                        id="promoCode"
                                        name="promoCode"
                                        placeholder="Promo Code"
                                        className="rounded-lg p-3 bg-neutral-800/80 text-white text-center flex-grow outline-1 outline-navBarRed focus:outline"
                                    />
                                    <button type='submit' className="ml-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                        Apply
                                    </button>
                                </form>
                                <div className="flex">
                                    <button onClick={editTickets} className="py-3 w-1/2 bg-neutral-800/80 text-white rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">Edit Tickets</button>
                                    <button onClick={editSeats} className="py-3 ml-1 flex-grow bg-neutral-800/80 text-white rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">Edit Seats</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-800/80 p-4 flex flex-col items-center">
                        <h2 className="text-4xl font-semibold w-full mb-4">Payment Information</h2>
                        <div className="w-3/4 h-full flex flex-col">
                            <div className="flex flex-col flex-grow">
                                {cards.map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardSelection(card.id)}
                                        className={`p-3 rounded-lg transition duration-300 ease-in-out mb-1 ${selectedCard === card.id ? "bg-navBarRed" : "hover:bg-red-800 bg-black"}`}
                                    >
                                        <div className="flex justify-between">
                                            <p>{card.friendlyName}</p>
                                            <p>Exp: {new Date(card.expirationDate).toLocaleString([], {
                                                month: '2-digit', 
                                                year: '2-digit'
                                            })}</p>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={() => handleCardSelection('new')}
                                    className={`p-3 rounded-lg transition duration-300 ease-in-out mt-4 ${selectedCard === 'new' ? "bg-navBarRed" : "hover:bg-red-800 bg-black"}`}
                                >
                                    New Card
                                </button>
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        value={cardNumber}
                                        onChange={handleCardNumber}
                                        className="my-1 rounded-lg p-3 bg-black text-white text-center outline-1 outline-navBarRed focus:outline"
                                        maxLength={16}
                                        minLength={16}
                                        required
                                    />
                                <div className="flex flex-row">
                                    <input
                                        type="text"
                                        placeholder="Exp. Date"
                                        value={expirationDate}
                                        onChange={handleExpirationDate}
                                        className="w-full mr-1 rounded-lg p-3 bg-black text-white text-center outline-1 outline-navBarRed focus:outline"
                                        maxLength={5}
                                        minLength={5}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={cvv}
                                        onChange={handleCvv}
                                        className=" w-full rounded-lg p-3 bg-black text-white text-center outline-1 outline-navBarRed focus:outline"
                                        maxLength={3}
                                        minLength={3}
                                        required
                                    />
                                </div>
                            </div>
                            <button onClick={handleBookingSubmission} className="p-3 bg-navBarRed text-white rounded-lg hover:bg-red-800 transition duration-300 ease-in-out">
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <RestrictedPage heading1="You must be signed in as a customer to view this page" heading2="Please log in to proceed" />
    );
}