/*import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed ,CalendarDays} from "lucide-react";

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

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  
  const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed ,CalendarDays} from "lucide-react";

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

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  
  const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

useEffect(() => {
  if (!movieId || !theatre || !date) return;

  console.log("SHOW FETCH PARAMS:", {
    movieId,
    theatre,
    date,
  });

  fetch(
    `http://localhost:5000/api/shows?movieId=${movieId}&theatreId=${theatre}&date=${date}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("SHOW API RESPONSE:", data);
      setShows(Array.isArray(data) ? data : []);
    });
}, [movieId, theatre, date]);


  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white p-8">
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-6">

        <h1 className="text-3xl font-bold text-purple-400">Book Tickets</h1>

        
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
        <button
  onClick={() => setShowCalendar(true)}
  disabled={!theatre}
  className="w-full p-3 bg-black border border-gray-600 rounded
             flex items-center justify-between"
>
  <span>{date || "Select Date"}</span>
  <CalendarDays className="w-5 h-5 text-gray-400" />
</button>



        
        {showCalendar && (
  <div className="bg-[#1a1a1a] p-4 rounded-lg mt-2 ">
    
    <div className="flex justify-between items-center mb-4">
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

      <span className="font-semibold">
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
        const formatted = formatDate(d);

        return (
          <button
            key={formatted}
            onClick={() => {
              setDate(formatted);
              setShowCalendar(false);
            }}
            className={`p-3 rounded
              ${
                date === formatted
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {d.getDate()}
          </button>
        );
      })}
    </div>
  </div>
)}

        
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
useEffect(() => {
  if (!movieId || !theatre || !date) return;

  console.log("SHOW FETCH PARAMS:", {
    movieId,
    theatre,
    date,
  });

  fetch(
    `http://localhost:5000/api/shows?movieId=${movieId}&theatreId=${theatre}&date=${date}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("SHOW API RESPONSE:", data);
      setShows(Array.isArray(data) ? data : []);
    });
}, [movieId, theatre, date]);


  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white p-8">
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-6">

        <h1 className="text-3xl font-bold text-purple-400">Book Tickets</h1>

        
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
        <button
  onClick={() => setShowCalendar(true)}
  disabled={!theatre}
  className="w-full p-3 bg-black border border-gray-600 rounded
             flex items-center justify-between"
>
  <span>{date || "Select Date"}</span>
  <CalendarDays className="w-5 h-5 text-gray-400" />
</button>



        
        {showCalendar && (
  <div className="bg-[#1a1a1a] p-4 rounded-lg mt-2 ">
    
    <div className="flex justify-between items-center mb-4">
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

      <span className="font-semibold">
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
        const formatted = formatDate(d);

        return (
          <button
            key={formatted}
            onClick={() => {
              setDate(formatted);
              setShowCalendar(false);
            }}
            className={`p-3 rounded
              ${
                date === formatted
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {d.getDate()}
          </button>
        );
      })}
    </div>
  </div>
)}

        
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

export default BookingPage;*/




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed, CalendarDays } from "lucide-react";

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

  /* ================= FETCH SHOWS ================= */
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white p-8">
      <div className="w-full max-w-3xl bg-[#232323] p-6 rounded-xl space-y-6">
        <h1 className="text-3xl font-bold text-purple-400">Book Tickets</h1>
         {/* DEBUG INFO - Add this after <h1> */}

        {/* LOCATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={detectLocation}
              disabled={locating}
              className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"
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
            <input
              value={city}
              onChange={(e) => handleCitySearch(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded"
              placeholder="Search city"
            />
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
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
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
          <div className="grid grid-cols-8 gap-2 justify-center">
            {seats.map((seat) => (
              <button
                key={seat.seatNumber}
                disabled={seat.isBooked}
                onClick={() => toggleSeat(seat.seatNumber)}
                className={`w-10 h-10 rounded ${
                  seat.isBooked
                    ? "bg-gray-700"
                    : selectedSeats.includes(seat.seatNumber)
                    ? "bg-purple-600"
                    : "bg-black border border-gray-600"
                }`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        )}

        {/* PAY */}
        <button
          disabled={!selectedSeats.length}
          onClick={() =>
            navigate("/payment", {
              state: { movieId, showId, selectedSeats },
            })
          }
          className="w-full py-3 bg-purple-600 rounded disabled:opacity-50"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
