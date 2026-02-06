import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AIRecommendations from "./pages/AIRecommendations";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";

import { useAuthStore } from "./store/authStore";

// Admin
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMovies from "./admin/pages/AdminMovies";
import AdminUpload from "./admin/pages/AdminUpload";
import AdminEditMovie from "./admin/pages/AdminEditMovie";

const App = () => {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔒 BLOCK UI UNTIL AUTH IS READY
  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-purple-400">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/book/:movieId" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="movies/:id/edit" element={<AdminEditMovie />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
