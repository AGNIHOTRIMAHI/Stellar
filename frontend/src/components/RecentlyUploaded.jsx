import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Play } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

import { useNavigate } from "react-router";

const RecentlyUploaded = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/movies/published"
        );
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMovies();
  }, []);

  if (!movies.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">
        Recently Uploaded Movies
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1220] to-[#05070d] border border-white/5 hover:border-purple-500/40 transition">

              {/* POSTER */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-72 w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="flex items-center gap-3 px-6 py-3 rounded-full
                  bg-purple-600 hover:bg-purple-500 text-white font-semibold
                  shadow-lg shadow-purple-600/40 scale-95 group-hover:scale-100 transition"
                >
                  <Play size={20} fill="white" />
                  Watch
                </button>
              </div>

              {/* INFO */}
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {movie.genre || "—"} {movie.year && `• ${movie.year}`}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RecentlyUploaded;
