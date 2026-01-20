import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Safety check
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#181818]">
        Invalid booking session
      </div>
    );
  }

  const { movieId, city, theater, time, seats, totalPrice } = state;

  const handlePayment = () => {
    alert("🎉 Payment Successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center px-4">
      
      {/* CENTER CARD */}
      <div className="w-full max-w-xl bg-[#232323] p-6 rounded-xl space-y-4 border border-purple-500/30 text-white">
        
        <h1 className="text-3xl font-bold text-purple-400 text-center">
          Payment
        </h1>

        <div>
          <span className="text-gray-400">Movie ID:</span>
          <p>{movieId}</p>
        </div>

        <div>
          <span className="text-gray-400">City:</span>
          <p>{city}</p>
        </div>

        <div>
          <span className="text-gray-400">Theatre:</span>
          <p>{theater}</p>
        </div>

        <div>
          <span className="text-gray-400">Show Time:</span>
          <p>{time}</p>
        </div>

        <div>
          <span className="text-gray-400">Seats:</span>
          <p>{seats.join(", ")}</p>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <span className="text-gray-400">Total Amount</span>
          <p className="text-2xl font-bold text-purple-400">
            ₹{totalPrice}
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-lg font-semibold transition"
        >
          Pay ₹{totalPrice}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
