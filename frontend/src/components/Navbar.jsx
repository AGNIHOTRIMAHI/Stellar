import { HelpCircle, LogOut, Settings, Search as SearchIcon, Shield } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout, fetchingUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  if (fetchingUser) {
    return (
      <nav className="bg-black h-20 flex items-center px-4">
        <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
      </nav>
    );
  }

  const isAdmin = user?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const avatarUrl = user ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=8b5cf6` : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
    navigate("/");
  };

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Fetch from both sources in parallel
        const [localRes, tmdbRes] = await Promise.all([
          fetch(`http://localhost:5000/api/movies/search?query=${query}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
              accept: "application/json",
            }
          }).then(res => res.json())
        ]);

        // Map local results
        const localItems = (localRes || []).map(m => ({
          id: m._id,
          title: m.title,
          year: m.year,
          poster: m.posterUrl,
          isLocal: true
        }));

        // Map TMDB results
        const tmdbItems = (tmdbRes.results || []).slice(0, 5).map(m => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.split("-")[0] || "N/A",
          poster: `https://image.tmdb.org/t/p/w200${m.poster_path}`,
          isLocal: false
        }));

        // Combine (Local first, then TMDB)
        setSuggestions([...localItems, ...tmdbItems]);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 relative z-[100]">
      <Link to="/">
        <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full cursor-pointer drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-80">
          <input
            type="text"
            placeholder="Search Movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/search?q=${query}`)}
            className="w-full px-5 py-2.5 rounded-full bg-purple-900/40 text-white placeholder-purple-300 outline-none border border-purple-500/20 focus:border-purple-500"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300" size={18} />

          {suggestions.length > 0 && (
            <div className="absolute top-14 left-0 w-full bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden z-[110]">
              {suggestions.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-purple-900/40 cursor-pointer transition border-b border-gray-800 last:border-0"
                >
                  <img src={movie.poster} alt="" className="w-10 h-14 object-cover rounded shadow-md" />
                  <div>
                    <p className="text-sm font-semibold text-white">{movie.title}</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs text-gray-400">{movie.year}</p>
                      {movie.isLocal && <span className="text-[10px] bg-purple-600 px-1 rounded text-white uppercase">Internal</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to={user ? "/ai-recommendations" : "/signin"}>
          <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-900 text-white font-semibold">Get AI Movie Picks</button>
        </Link>

        {isAdmin && !isAdminRoute && (
          <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-800 text-white"><Shield size={16} />Admin Panel</button>
        )}

        {!user ? (
          <Link to="/signin"><button className="px-4 py-2 border border-purple-500 rounded-lg text-purple-400">Sign In</button></Link>
        ) : (
          <div className="relative">
            <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border-2 border-purple-600 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-[#232323] rounded-xl shadow-lg p-4 flex flex-col gap-2 z-50">
                <div className="text-center border-b border-gray-700 pb-3">
                  <p className="font-semibold text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a]"><HelpCircle size={16} /> Help Center</button>
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2a2a2a]"><Settings size={16} /> Settings</button>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400"><LogOut size={16} /> Log Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;