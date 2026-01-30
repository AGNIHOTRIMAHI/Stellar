import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed, CalendarDays } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  /* ================= LOCATION ================= */
  const [cityMode, setCityMode] = useState("auto");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ================= BOOKING ================= */
  const [theatres, setTheatres] = useState([]);
  const [theatre, setTheatre] = useState("");

  const [date, setDate] = useState("");
  const [shows, setShows] = useState([]);
  const [showId, setShowId] = useState("");

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* ================= PAYMENT ================= */
  const [processing, setProcessing] = useState(false);

  /* ================= CALENDAR ================= */
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ================= HELPERS ================= */
  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const generateMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) =>
      new Date(year, month, i + 1)
    );
  };

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  /* ================= LOCATION ================= */
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

  /* ================= FETCH THEATRES ================= */
  useEffect(() => {
    if (!city) return;

    fetch(
      `http://localhost:5000/api/theatres?city=${encodeURIComponent(
        city.trim()
      )}`
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

  /* ================= FETCH SHOWS ================= */
  useEffect(() => {
    if (!movieId || !theatre || !date) return;

    console.log("📡 Fetching shows with:", {
      movieId,
      theatre,
      date,
    });

    fetch(
      `http://localhost:5000/api/shows?movieId=${movieId}&theatreId=${theatre}&date=${date}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch shows");
        }
        return res.json();
      })
      .then((data) => {
        console.log("🎬 SHOW API RESPONSE:", data);
        setShows(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Show fetch error:", err);
        setShows([]);
      });
  }, [movieId, theatre, date]);

  /* ================= FETCH SEATS ================= */
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

  /* ================= PAYMENT HANDLER ================= */
  const handlePayment = async () => {
    if (!selectedSeats.length) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Create order
      const orderResponse = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          showId,
          seats: selectedSeats,
        }
      );

      const { order, amount, key } = orderResponse.data;

      console.log("📦 Order created:", order);

      // Step 2: Open Razorpay checkout
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Stellar Cinema",
        description: "Movie Ticket Booking",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                showId: showId,
                seats: selectedSeats,
              }
            );

            if (verifyResponse.data.success) {
              toast.success("🎉 Booking confirmed!");
              // Navigate to booking confirmation page or home
              navigate("/", { state: { bookingSuccess: true } });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#9333ea",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white transition-all duration-300 ease-in-out">
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-6">
        <h1 className="text-3xl font-bold text-purple-400">Book Tickets</h1>

        {/* LOCATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={detectLocation}
              disabled={locating}
              className="w-12 h-12 rounded-full bg-purple-600
             hover:bg-purple-500 active:scale-95
             transition-all duration-200
             flex items-center justify-center
             shadow-lg disabled:opacity-50"
            >
              <LocateFixed />
            </button>

            <div>
              <div className="text-sm text-gray-400">Your location</div>
              <div className="flex gap-2 items-center">
                <span className="text-lg">{city || "Detecting..."}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCityMode("manual")}
            className="text-sm text-purple-400"
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
                <div
                  className="absolute z-50 mt-1 w-full bg-[#1f1f1f]
                                border border-gray-700 rounded-lg shadow-xl
                                max-h-60 overflow-auto"
                >
                  {suggestions.map((s, index) => (
                    <button
                      key={s.place_id}
                      onClick={() => {
                        setCity(s.structured_formatting.main_text);
                        setSuggestions([]);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm
                        ${
                          index === activeIndex
                            ? "bg-purple-600/30"
                            : "hover:bg-purple-600/20"
                        }`}
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
        <button
          onClick={() => setShowCalendar(true)}
          disabled={!theatre}
          className="w-full p-3 bg-black border border-gray-600 rounded flex justify-between"
        >
          <span>{date || "Select Date"}</span>
          <CalendarDays />
        </button>

        {showCalendar && (
          <div
            className="bg-[#1a1a1a] p-4 rounded-lg
                  animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between mb-3">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
              >
                ◀
              </button>
              <span>
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateMonthDates().map((d) => {
                const f = formatDate(d);
                return (
                  <button
                    key={f}
                    onClick={() => {
                      setDate(f);
                      setShowCalendar(false);
                    }}
                    className={`p-2 rounded ${
                      date === f ? "bg-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SHOW TIMES */}
        {shows.length > 0 && (
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Select Show Time</h3>
            <div className="flex flex-wrap gap-3">
              {shows.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setShowId(s._id)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium
    transition-all duration-200
    ${
      showId === s._id
        ? "bg-purple-600 border-purple-600 shadow-md"
        : "bg-black border-gray-600 hover:border-purple-400 hover:shadow-sm"
    }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEATS */}
        {seats.length > 0 && (
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Select Seats</h3>
            <div className="grid grid-cols-8 gap-2 justify-center">
              {seats.map((seat) => (
                <button
                  key={seat.seatNumber}
                  disabled={seat.isBooked}
                  onClick={() => toggleSeat(seat.seatNumber)}
                  className={`w-10 h-10 rounded-md text-xs font-semibold
    transition-all duration-150
    ${
      seat.isBooked
        ? "bg-gray-700 cursor-not-allowed"
        : selectedSeats.includes(seat.seatNumber)
        ? "bg-purple-600 scale-105 shadow-md"
        : "bg-black border border-gray-600 hover:border-purple-400 hover:scale-105"
    }`}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>

            {selectedSeats.length > 0 && (
              <div className="mt-4 p-3 bg-black rounded-lg">
                <p className="text-sm text-gray-400">Selected Seats:</p>
                <p className="text-lg font-semibold text-purple-400">
                  {selectedSeats.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* PAY BUTTON */}
        <button
          disabled={!selectedSeats.length || processing}
          onClick={handlePayment}
          className="w-full py-3 rounded-lg text-lg font-semibold
             bg-gradient-to-r from-purple-600 to-purple-500
             hover:from-purple-500 hover:to-purple-400
             transition-all duration-200
             disabled:opacity-40 disabled:cursor-not-allowed
             shadow-lg hover:shadow-xl"
        >
          {processing ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;