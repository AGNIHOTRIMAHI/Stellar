/*import { HelpCircle, LogOut, Search, Settings } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}&backgroundColor=8b5cf6`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };
  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };
  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      <Link to={"/"}>
        <img
          src={Logo}
          alt="Logo"
          className="w-15 h-15 cursor-pointer brightness-125 rounded-full object-cover drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
        />
      </Link>

      <ul className="hidden xl:flex space-x-6">
        <li className="cursor-pointer hover:text-[#bc2ddc]">Home</li>
        
        
        
      </ul>

      <div className="flex items-center space-x-4 relative">
        <div className="relative hidden md:inline-flex">
          <input
            type="text"
            
            placeholder="Search..."
            value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-72 px-5 py-2.5 rounded-full text-sm
          bg-linear-to-r from-purple-900 to-purple-700
          text-white placeholder-purple-300
          focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
          onClick={handleSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
        >
          <Search size={18} />
        </button>
        </div>

        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="group relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white
  bg-linear-to-r from-purple-600 to-pink-900
  transition-all duration-300 ease-out
  hover:-translate-y-0.5 hover:shadow-lg">
    <span className="absolute inset-0 rounded-lg bg-purple-500 opacity-0 blur-md group-hover:opacity-30 transition" />

  <span className="relative z-10">
                 Get AI Movie Picks
  </span>
           
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="px-5 py-2.5 rounded-lg text-sm font-medium
  text-purple-400 border border-purple-500/40
  transition-all duration-300 ease-out
  hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-400">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white">
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-[#820875] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;*/




import {
  HelpCircle,
  LogOut,
  Settings,
  Search as SearchIcon,
} from "lucide-react";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  // 🔍 SEARCH STATE
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}&backgroundColor=8b5cf6`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  /* ---------------- TMDB SEARCH ---------------- */

  const options = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    },
  };

  // 🔥 LIVE SEARCH (DEBOUNCED)
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
        .then((data) => {
          setSuggestions(data.results?.slice(0, 6) || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // reset highlight when typing
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSearchClick = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      {/* LOGO */}
      <Link to="/">
        <img
          src={Logo}
          alt="Logo"
          className="w-15 h-15 cursor-pointer brightness-125 rounded-full object-cover drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
        />
      </Link>

      {/* CENTER LINKS */}
      <ul className="hidden xl:flex space-x-6">
        
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-4 relative">
        {/* 🔍 SEARCH */}
        <div className="relative hidden md:inline-flex w-80">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (!suggestions.length) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev < suggestions.length - 1 ? prev + 1 : 0
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : suggestions.length - 1
                );
              }

              if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex >= 0) {
                  navigate(`/movie/${suggestions[activeIndex].id}`);
                  setQuery("");
                  setSuggestions([]);
                  setActiveIndex(-1);
                } else {
                  handleSearchClick();
                }
              }

              if (e.key === "Escape") {
                setSuggestions([]);
                setActiveIndex(-1);
              }
            }}
            className="w-full px-5 py-2.5 rounded-full text-sm
            bg-linear-to-r from-purple-900 to-purple-500
            text-white placeholder-purple-300
            focus:outline-none focus:ring-2 focus:ring-pink-200"
          />

          <button
            onClick={handleSearchClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
          >
            <SearchIcon size={18} />
          </button>

          {/* 🔽 LIVE RESULTS */}
          {query && (
            <div className="absolute top-full mt-2 w-full bg-[#1f1f1f] rounded-xl shadow-xl z-50 overflow-hidden">
              {loading ? (
                <div className="p-3 text-sm text-purple-400">
                  Searching...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-3 text-sm text-gray-400">
                  No results found
                </div>
              ) : (
                suggestions.map((movie, index) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      navigate(`/movie/${movie.id}`);
                      setQuery("");
                      setSuggestions([]);
                      setActiveIndex(-1);
                    }}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition
                      ${
                        index === activeIndex
                          ? "bg-purple-600/25"
                          : "hover:bg-purple-500/10"
                      }`}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        className="w-10 h-14 object-cover rounded"
                        alt={movie.title}
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-700 rounded" />
                    )}

                    <div>
                      <p className="text-sm font-medium">
                        {movie.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {movie.release_date?.slice(0, 4)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* AI BUTTON */}
        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="group relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white
          bg-linear-to-r from-purple-600 to-pink-900
          transition-all duration-300 ease-out
          hover:-translate-y-0.5 hover:shadow-lg">
            <span className="absolute inset-0 rounded-lg bg-purple-500 opacity-0 blur-md group-hover:opacity-30 transition" />
            <span className="relative z-10">
              Get AI Movie Picks
            </span>
          </button>
        </Link>

        {/* AUTH */}
        {!user ? (
          <Link to="/signin">
            <button className="px-5 py-2.5 rounded-lg text-sm font-medium
            text-purple-400 border border-purple-500/40
            transition-all duration-300 ease-out
            hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-400">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="relative">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-[#820875] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user.email}
                  </span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg bg-[#181818] hover:bg-[#1d1c1c] gap-3">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg bg-[#181818] hover:bg-[#1d1c1c] gap-3">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg bg-[#181818] hover:bg-[#1d1c1c] gap-3"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
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
