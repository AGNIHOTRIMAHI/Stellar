import {
  HelpCircle,
  LogOut,
  Settings,
  Search as SearchIcon,
  Ticket,
  Sparkles,
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
  const [scrolled, setScrolled] = useState(false);

  // 🔍 SEARCH STATE
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchFocused, setSearchFocused] = useState(false);

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}&backgroundColor=8b5cf6`
    : "";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .navbar-container {
          font-family: 'Outfit', sans-serif;
        }
        
        .glow-effect {
          position: relative;
        }
        
        .glow-effect::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #a855f7, #ec4899, #8b5cf6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .glow-effect:hover::before {
          opacity: 1;
        }
        
        .shimmer {
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 75%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .glass-morphism {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .search-glow {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.15),
                      0 0 40px rgba(168, 85, 247, 0.1),
                      inset 0 0 20px rgba(168, 85, 247, 0.05);
        }
        
        .search-glow-active {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.3),
                      0 0 60px rgba(168, 85, 247, 0.2),
                      inset 0 0 30px rgba(168, 85, 247, 0.1);
        }
        
        .nav-item {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #a855f7, #ec4899);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover::after {
          width: 100%;
        }
        
        .dropdown-enter {
          animation: dropdownEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes dropdownEnter {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .suggestion-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .suggestion-item:hover {
          transform: translateX(4px);
        }
        
        .ai-button {
          position: relative;
          overflow: hidden;
        }
        
        .ai-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }
        
        .ai-button:hover::before {
          left: 100%;
        }
        
        .logo-glow {
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))
                  drop-shadow(0 0 40px rgba(168, 85, 247, 0.3));
          transition: filter 0.3s ease;
        }
        
        .logo-glow:hover {
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))
                  drop-shadow(0 0 60px rgba(168, 85, 247, 0.5));
        }
      `}</style>

      <nav
        className={`navbar-container fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-morphism shadow-2xl"
            : "bg-gradient-to-b from-black/95 via-black/90 to-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center px-6 lg:px-8 h-20">
          {/* LOGO */}
          <Link to="/" className="relative group">
            <img
              src={Logo}
              alt="Logo"
              className="w-14 h-14 cursor-pointer rounded-full object-cover logo-glow
                       transform transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 
                          opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </Link>

          {/* CENTER LINKS */}
          <ul className="hidden xl:flex items-center space-x-8">
            {user && (
              <Link to="/my-bookings">
                <li className="nav-item cursor-pointer text-gray-300 hover:text-white 
                             flex items-center gap-2.5 font-medium tracking-wide">
                  <Ticket className="w-4 h-4" />
                  <span>My Bookings</span>
                </li>
              </Link>
            )}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4 relative">
            {/* 🔍 SEARCH */}
            <div className="relative hidden md:inline-flex w-96">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
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
                  className={`w-full px-6 py-3 pr-12 rounded-2xl text-sm font-medium
                    bg-gradient-to-r from-purple-950/40 to-fuchsia-950/40
                    border border-purple-500/20
                    text-gray-200 placeholder-purple-300/50
                    focus:outline-none focus:border-purple-400/40
                    transition-all duration-300
                    ${searchFocused ? 'search-glow-active' : 'search-glow'}
                  `}
                />

                <button
                  onClick={handleSearchClick}
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                           text-purple-400 hover:text-purple-300 
                           transition-colors duration-200"
                >
                  <SearchIcon size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* 🔽 LIVE RESULTS */}
              {query && (
                <div className="dropdown-enter absolute top-full mt-3 w-full glass-morphism 
                              rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10">
                  {loading ? (
                    <div className="p-4 text-sm text-purple-400 font-medium flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-4 text-sm text-gray-400 font-medium">
                      No results found
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto">
                      {suggestions.map((movie, index) => (
                        <div
                          key={movie.id}
                          onClick={() => {
                            navigate(`/movie/${movie.id}`);
                            setQuery("");
                            setSuggestions([]);
                            setActiveIndex(-1);
                          }}
                          className={`suggestion-item flex items-center gap-4 p-4 cursor-pointer
                            ${
                              index === activeIndex
                                ? "bg-gradient-to-r from-purple-600/25 to-fuchsia-600/25"
                                : "hover:bg-white/5"
                            }
                            ${index !== suggestions.length - 1 ? 'border-b border-white/5' : ''}
                          `}
                        >
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                              className="w-12 h-16 object-cover rounded-lg shadow-lg"
                              alt={movie.title}
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 
                                          rounded-lg flex items-center justify-center">
                              <SearchIcon size={16} className="text-purple-400/50" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {movie.title}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                              {movie.release_date?.slice(0, 4) || 'N/A'}
                            </p>
                          </div>

                          {movie.vote_average > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg 
                                          bg-purple-500/20 border border-purple-500/30">
                              <span className="text-xs font-bold text-purple-300">
                                {movie.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI BUTTON */}
            <Link to={user ? "ai-recommendations" : "signin"}>
              <button
                className="ai-button group px-6 py-3 rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600
                  shadow-lg shadow-purple-500/25
                  transition-all duration-300 ease-out
                  hover:shadow-xl hover:shadow-purple-500/40
                  hover:-translate-y-0.5
                  border border-purple-400/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                  AI Picks
                </span>
              </button>
            </Link>

            {/* AUTH */}
            {!user ? (
              <Link to="/signin">
                <button
                  className="glow-effect px-6 py-3 rounded-xl text-sm font-bold
                    text-purple-300 bg-purple-950/30
                    border border-purple-500/30
                    transition-all duration-300 ease-out
                    hover:bg-purple-950/50 hover:text-white hover:border-purple-400/50
                    hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative group"
                >
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-11 h-11 rounded-xl border-2 border-purple-500/40 
                             cursor-pointer transition-all duration-300
                             group-hover:border-purple-400 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                                opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                </button>

                {showMenu && (
                  <div className="dropdown-enter absolute right-0 mt-3 w-72 glass-morphism 
                                rounded-2xl z-50 shadow-2xl p-2 border border-white/10">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 mb-2 rounded-xl bg-gradient-to-r 
                                  from-purple-950/30 to-fuchsia-950/30 border border-purple-500/20">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-12 h-12 rounded-lg border-2 border-purple-500/40"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link to="/my-bookings">
                        <button
                          onClick={() => setShowMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                   text-gray-300 hover:text-white hover:bg-white/5
                                   transition-all duration-200 font-medium text-sm"
                        >
                          <Ticket className="w-4 h-4" strokeWidth={2.5} />
                          My Bookings
                        </button>
                      </Link>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                       text-gray-300 hover:text-white hover:bg-white/5
                                       transition-all duration-200 font-medium text-sm">
                        <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
                        Help Center
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                       text-gray-300 hover:text-white hover:bg-white/5
                                       transition-all duration-200 font-medium text-sm">
                        <Settings className="w-4 h-4" strokeWidth={2.5} />
                        Settings
                      </button>

                      <div className="h-px bg-white/10 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                 text-red-400 hover:text-red-300 hover:bg-red-500/10
                                 transition-all duration-200 font-medium text-sm"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2.5} />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;