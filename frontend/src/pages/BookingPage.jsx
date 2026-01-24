import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed } from "lucide-react";

const POPULAR_CITIES = ["Prayagraj", "Delhi", "Mumbai", "Bangalore"];

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  // 📍 Location
  const [cityMode, setCityMode] = useState("auto");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // 🔍 Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // 🎟 Booking
  const [theatres, setTheatres] = useState([]);
  const [theatre, setTheatre] = useState("");
  const [date, setDate] = useState("");
  const [shows, setShows] = useState([]);
  const [showId, setShowId] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* =========================
     GOOGLE CITY AUTOCOMPLETE
     ========================= */
  const handleCitySearch = (value) => {
    setCity(value);

    if (!window.google || !value) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value,
        types: ["(cities)"],
        componentRestrictions: { country: "in" },
      },
      (predictions) => setSuggestions(predictions || [])
    );
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  /* =========================
     AUTO LOCATION
     ========================= */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setLocating(true);
    setCity("");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `http://localhost:5000/api/location/city?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          setCity(data.city);
          setCityMode("auto");
        } catch {
          setCityMode("manual");
          setLocationError("Unable to detect city");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setCityMode("manual");
        setLocationError("Location permission denied");
        setLocating(false);
      }
    );
  };

  useEffect(() => {
    if (cityMode === "auto" && !city) detectLocation();
    // eslint-disable-next-line
  }, [cityMode]);

  /* =========================
     FETCH THEATRES
     ========================= */
  useEffect(() => {
    if (!city) return;

    fetch(
  `http://localhost:5000/api/theatres?city=${encodeURIComponent(city.trim())}`
)

      .then((res) => res.json())
      .then((data) => {
        setTheatres(data || []);
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

  /* =========================
     SEAT TOGGLE
     ========================= */
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
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-6">

        <h1 className="text-3xl font-bold text-purple-400">Book Tickets</h1>

        {/* LOCATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={detectLocation}
              disabled={locating}
              className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700
                         flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              <LocateFixed className="w-6 h-6 text-white" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Your location
              </span>

              <div className="flex items-center gap-2">
                {locating ? (
                  <span className="text-sm text-gray-300">
                    Detecting location...
                  </span>
                ) : city ? (
                  <>
                    <span className="text-lg font-semibold">{city}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-600/20 text-purple-400">
                      detected
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">
                    Use current location
                  </span>
                )}
              </div>

              {locationError && (
                <p className="text-xs text-red-400 mt-1">
                  {locationError}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setCityMode("manual")}
            className="text-sm text-purple-400 hover:underline"
          >
            Select city manually
          </button>

          {cityMode === "manual" && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search city"
                value={city}
                onChange={(e) => handleCitySearch(e.target.value)}
                onKeyDown={(e) => {
                  if (!suggestions.length) return;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) =>
                      i < suggestions.length - 1 ? i + 1 : 0
                    );
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) =>
                      i > 0 ? i - 1 : suggestions.length - 1
                    );
                  }

                  if (e.key === "Enter" && activeIndex >= 0) {
                    e.preventDefault();
                    setCity(
                      suggestions[activeIndex].structured_formatting.main_text
                    );
                    setSuggestions([]);
                  }

                  if (e.key === "Escape") setSuggestions([]);
                }}
                className="w-full p-3 bg-black border border-gray-600 rounded"
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-[#1f1f1f]
                                border border-gray-700 rounded-lg shadow-xl
                                max-h-60 overflow-auto">
                  {suggestions.map((s, index) => (
                    <button
                      key={s.place_id}
                      onClick={() => {
                        setCity(s.structured_formatting.main_text);
                        setSuggestions([]);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm
                        ${index === activeIndex
                          ? "bg-purple-600/30"
                          : "hover:bg-purple-600/20"}`}
                    >
                      <p className="font-medium">
                        {s.structured_formatting.main_text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.structured_formatting.secondary_text}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
          className="w-full p-3 bg-black border border-gray-600 rounded"
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

        {/* SEATS */}
        {seats.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-purple-300 mb-2">
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
                      ${seat.isBooked
                        ? "bg-gray-700 cursor-not-allowed"
                        : selected
                        ? "bg-purple-600"
                        : "bg-black border border-gray-600 hover:border-purple-500"}`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
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
