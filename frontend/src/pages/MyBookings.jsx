import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Ticket, Calendar, MapPin, Clock, IndianRupee } from "lucide-react";

axios.defaults.withCredentials = true;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings"
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Ticket className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-purple-400">My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#232323] rounded-xl p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">
              Book your first movie ticket now!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg
                       transition-all duration-200"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#232323] rounded-xl p-6 hover:bg-[#2a2a2a]
                         transition-all duration-200 border border-gray-800
                         hover:border-purple-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-1">
                      Booking #{booking._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Booked on {formatDate(booking.createdAt)} at{" "}
                      {formatTime(booking.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-green-400">
                      <IndianRupee className="w-5 h-5" />
                      {booking.totalAmount}
                    </div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                  </div>
                </div>

                {/* Show Details */}
                {booking.showId && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Theatre</p>
                        <p className="font-medium">
                          {booking.showId.theatreId?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Show Date</p>
                        <p className="font-medium">
                          {booking.showId.date || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Show Time</p>
                        <p className="font-medium">
                          {booking.showId.time || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seats */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-2">Selected Seats:</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-3 py-1 bg-purple-600/20 border border-purple-600
                                 rounded-md text-purple-300 font-mono text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                {booking.paymentId && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Payment ID: {booking.paymentId}</span>
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded">
                        Paid
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;