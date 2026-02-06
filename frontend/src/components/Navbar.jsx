import {
  HelpCircle,
  LogOut,
  Settings,
  Search as SearchIcon,
  Shield,
} from "lucide-react";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout, fetchingUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ IMPORTANT

  const [showMenu, setShowMenu] = useState(false);

  /* ---------------- WAIT FOR AUTH ---------------- */
  if (fetchingUser) {
    return (
      <nav className="bg-black h-20 flex items-center px-4">
        <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
      </nav>
    );
  }

  const isAdmin = user?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin"); // ✅ KEY FIX

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}&backgroundColor=8b5cf6`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
    navigate("/");
  };

  /* ---------------- SEARCH ---------------- */
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const options = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    },
  };

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`,
        options
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data.results?.slice(0, 6) || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchClick = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20">
      {/* LOGO */}
      <Link to="/">
        <img
          src={Logo}
          alt="Logo"
          className="w-12 h-12 rounded-full cursor-pointer drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
        />
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 relative">
        {/* SEARCH */}
        <div className="relative hidden md:inline-flex w-80">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-5 py-2.5 rounded-full bg-purple-900 text-white placeholder-purple-300"
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <SearchIcon size={18} />
          </button>
        </div>

        {/* AI BUTTON (UNCHANGED) */}
        <Link to={user ? "/ai-recommendations" : "/signin"}>
          <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-900 text-white font-semibold">
            Get AI Movie Picks
          </button>
        </Link>

        {/* ✅ ADMIN PANEL BUTTON */}
        {isAdmin && !isAdminRoute && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 transition"
          >
            <Shield size={16} />
            Admin Panel
          </button>
        )}

        {/* AUTH */}
        {!user ? (
          <Link to="/signin">
            <button className="px-4 py-2 border border-purple-500 rounded-lg text-purple-400">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="relative">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-purple-600 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-[#232323] rounded-xl shadow-lg p-4 flex flex-col gap-2 z-50">
                <div className="text-center border-b border-gray-700 pb-3">
                  <p className="font-semibold text-white">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>

                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a]">
                  <HelpCircle size={16} /> Help Center
                </button>

                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a]">
                  <Settings size={16} /> Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/10 text-red-400"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
