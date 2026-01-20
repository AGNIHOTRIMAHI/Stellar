import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const rows = ["A", "B", "C", "D", "E"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];
const SEAT_PRICE = 200;

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [theater, setTheater] = useState("");
  const [time, setTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const totalPrice = selectedSeats.length * SEAT_PRICE;

  const handleConfirm = () => {
    if (!city || !theater || !time || selectedSeats.length === 0) {
      alert("Please select city, theatre, time and seats");
      return;
    }

    navigate("/payment", {
      state: {
        movieId,
        city,
        theater,
        time,
        seats: selectedSeats,
        totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center">
  
    <div className="min-h-screen bg-[#181818] text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        Book Tickets
      </h1>

      <div className="max-w-3xl space-y-6 bg-[#232323] p-6 rounded-lg border border-purple-500/20">

        {/* CITY */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 bg-[#181818] rounded border border-gray-700 focus:border-purple-500"
        >
          <option value="" disabled hidden>Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        {/* THEATRE */}
        <select
          value={theater}
          onChange={(e) => setTheater(e.target.value)}
          disabled={!city}
          className="w-full p-3 bg-[#181818] rounded border border-gray-700 focus:border-purple-500 disabled:opacity-50"
        >
          <option value="" disabled hidden>Select Theatre</option>
          <option value="PVR">PVR Cinemas</option>
          <option value="INOX">INOX</option>
          <option value="Cinepolis">Cinepolis</option>
        </select>

        {/* TIME */}
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={!theater}
          className="w-full p-3 bg-[#181818] rounded border border-gray-700 focus:border-purple-500 disabled:opacity-50"
        >
          <option value="" disabled hidden>Select Show Time</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="1:30 PM">1:30 PM</option>
          <option value="6:00 PM">6:00 PM</option>
          <option value="9:30 PM">9:30 PM</option>
        </select>

        {/* SEAT MATRIX */}
        {time && (
          <>
            <h2 className="text-xl font-semibold mt-4 text-purple-300">
              Select Seats
            </h2>

            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex gap-2 justify-center">
                  {cols.map((col) => {
                    const seat = `${row}${col}`;
                    const selected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`w-10 h-10 rounded text-sm font-semibold
                          ${
                            selected
                              ? "bg-purple-600"
                              : "bg-[#181818] border border-gray-600 hover:border-purple-500"
                          }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {/* SUMMARY */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 text-gray-300">
            <p>
              Seats:{" "}
              <span className="text-white font-semibold">
                {selectedSeats.join(", ")}
              </span>
            </p>
            <p>
              Total:{" "}
              <span className="text-purple-400 font-bold">
                ₹{totalPrice}
              </span>
            </p>
          </div>
        )}

        {/* CONFIRM */}
        <button
          onClick={handleConfirm}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-lg font-semibold transition"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
    </div>


  );
};

export default BookingPage;
