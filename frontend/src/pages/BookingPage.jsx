import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  // location
  const [cityMode, setCityMode] = useState("auto");
  const [city, setCity] = useState("");

  // booking states
  const [theatres, setTheatres] = useState([]);
  const [theatre, setTheatre] = useState("");
  const [date, setDate] = useState("");

  const [shows, setShows] = useState([]);
  const [showId, setShowId] = useState("");

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* =========================
     AUTO LOCATION
     ========================= */
  useEffect(() => {
    if (cityMode !== "auto") return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `http://localhost:5000/api/location/city?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          setCity(data.city);
        } catch {
          setCityMode("manual");
        }
      },
      () => setCityMode("manual")
    );
  }, [cityMode]);

  /* =========================
     FETCH THEATRES
     ========================= */
  useEffect(() => {
    if (!city) return;

    fetch(`http://localhost:5000/api/theatres?city=${city}`)
      .then((res) => res.json())
      .then((data) => {
        setTheatres(data);
        setTheatre("");
        setShows([]);
        setShowId("");
        setSeats([]);
        setSelectedSeats([]);
      });
  }, [city]);

  /* =========================
     FETCH SHOWS
     ========================= */
  useEffect(() => {
    if (!movieId || !theatre || !date) return;

    fetch(
      `http://localhost:5000/api/shows?movieId=${movieId}&theatreId=${theatre}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        setShows(Array.isArray(data) ? data : []);
        setShowId("");
        setSeats([]);
        setSelectedSeats([]);
      });
  }, [movieId, theatre, date]);

  /* =========================
     FETCH SEATS
     ========================= */
  useEffect(() => {
    if (!showId) return;

    fetch(`http://localhost:5000/api/shows/${showId}/seats`)
      .then((res) => res.json())
      .then((data) => {
        setSeats(Array.isArray(data) ? data : []);
        setSelectedSeats([]);
      });
  }, [showId]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white p-8">
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-5">

        <h1 className="text-3xl font-bold text-purple-400">
          Book Tickets
        </h1>

        {/* LOCATION MODE */}
        <select
          value={cityMode}
          onChange={(e) => {
            setCityMode(e.target.value);
            setCity("");
          }}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        >
          <option value="auto">Use Current Location</option>
          <option value="manual">Search City Manually</option>
        </select>

        {/* CITY */}
        {cityMode === "manual" ? (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 bg-black border border-gray-600 rounded"
          >
            <option value="">Select City</option>
            <option value="Prayagraj">Prayagraj</option>
            <option value="Delhi">Delhi</option>
          </select>
        ) : (
          <div className="p-3 bg-black border border-gray-600 rounded">
            {city || "Detecting location..."}
          </div>
        )}

        {/* THEATRE */}
        <select
          value={theatre}
          onChange={(e) => setTheatre(e.target.value)}
          disabled={!theatres.length}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        >
          <option value="">Select Theatre</option>
          {theatres.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
          className="w-full p-3 bg-black text-white border border-gray-600 rounded
                     focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                     [&::-webkit-calendar-picker-indicator]:invert"
        />

        {/* SHOW */}
        <select
          value={showId}
          onChange={(e) => setShowId(e.target.value)}
          disabled={!shows.length}
          className="w-full p-3 bg-black border border-gray-600 rounded"
        >
          <option value="">Select Show</option>
          {shows.map((s) => (
            <option key={s._id} value={s._id}>
              {s.time}
            </option>
          ))}
        </select>

        {/* SEAT MATRIX */}
        {seats.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-purple-300">
              Select Seats
            </h2>

            <div className="grid grid-cols-8 gap-2 justify-center">
              {seats.map((seat) => {
                const selected = selectedSeats.includes(seat.seatNumber);

                return (
                  <button
                    key={seat.seatNumber}
                    disabled={seat.isBooked}
                    onClick={() => toggleSeat(seat.seatNumber)}
                    className={`w-10 h-10 rounded text-sm font-semibold
                      ${
                        seat.isBooked
                          ? "bg-gray-700 cursor-not-allowed"
                          : selected
                          ? "bg-purple-600"
                          : "bg-black border border-gray-600 hover:border-purple-500"
                      }`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* CONFIRM */}
        <button
          disabled={!selectedSeats.length}
          onClick={() =>
            navigate("/payment", {
              state: { movieId, showId, selectedSeats },
            })
          }
          className="w-full py-3 bg-purple-600 rounded text-lg font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm & Pay
        </button>

      </div>
    </div>
  );
};

export default BookingPage;
