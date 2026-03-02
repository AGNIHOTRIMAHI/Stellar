import { Play, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Moviepage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLocal, setIsLocal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerRef = useRef(null);
  const [trailerInsight, setTrailerInsight] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NjkzNTQ3Y2EwZTRjMDZiZGFjM2I0MWIxMzVkMjQ2ZCIsIm5iZiI6MTc2ODE1ODUxMi4wMiwic3ViIjoiNjk2M2Y1MzA2MzcxMmRiMWQ0OTBkMTkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TwbgPEkR1KYwKlu38XRpc6zhLpvEoKw3ipDWcKORoLQ",
    },
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, { credentials: "include" });
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieId: String(id), text: commentText }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  useEffect(() => {
    setTrailerInsight(null);
    setShowTrailer(false);
    fetchComments();

    fetch(`http://localhost:5000/api/movies/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setIsLocal(true);
        setMovie({
          title: data.title,
          overview: data.description,
          backdrop_path: data.posterUrl,
          poster_path: data.posterUrl,
          vote_average: 0,
          release_date: data.year,
          runtime: "N/A",
          genres: [{ id: 0, name: data.genre }],
        });
        setTrailerKey(data.videoUrl);
      })
      .catch(() => {
        setIsLocal(false);
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
          .then((res) => res.json())
          .then(setMovie)
          .catch(console.error);

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
          .then((res) => res.json())
          .then((res) => {
            const vids = res.results || [];
            const trailer = vids.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
            setTrailerKey(trailer?.key || null);
          });

        fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`, options)
          .then((res) => res.json())
          .then((res) => setRecommendations(res.results || []));
      });
  }, [id]);

  const toggleTrailer = () => {
    if (!trailerKey) return;
    setShowTrailer((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => {
          trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      return next;
    });
  };

  const summarizeTrailer = async () => {
    if (isSummarizing || !movie) return;
    setIsSummarizing(true);
    try {
      const prompt = `Describe how this trailer FEELS to watch. No plot spoilers. Emotion, pacing, vibe only. "${movie.overview}"`;
      const { getAIRecommendation } = await import("../lib/AIModel");
      const aiText = await getAIRecommendation(prompt);
      setTrailerInsight({
        tone: "Cinematic", pace: "Dynamic", vibe: movie.genres.map(g => g.name).join(", "),
        audience: "Fans of immersive storytelling", story: aiText.trim()
      });
    } catch {
      setTrailerInsight({
        tone: "Engaging", pace: "Balanced", vibe: movie.genres.map(g => g.name).join(", "),
        audience: "General Audience", story: "Visual and emotional breakdown currently unavailable."
      });
    }
    setIsSummarizing(false);
  };

  if (!movie) return <div className="min-h-screen bg-[#181818] flex items-center justify-center text-purple-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <div className="relative h-[60vh]" style={{ 
        backgroundImage: `url(${isLocal ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`})`,
        backgroundSize: "cover", backgroundPosition: "center" 
      }}>
        <div className="absolute inset-0 bg-linear-to-t from-[#181818] via-transparent to-transparent" />
        <div className="relative z-10 flex items-end p-8 gap-8">
          <img src={isLocal ? movie.poster_path : `https://image.tmdb.org/t/p/original${movie.poster_path}`} className="rounded-lg shadow-lg w-48 hidden md:block" alt={movie.title} />
          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <div className="flex gap-4 mt-2 text-sm">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.map((g) => <span key={g.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{g.name}</span>)}
            </div>
            <p className="max-w-2xl mt-4 text-gray-200">{movie.overview}</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <button onClick={toggleTrailer} disabled={!trailerKey} className={`flex items-center px-5 py-3 rounded-full font-medium transition ${trailerKey ? "bg-purple-700 hover:bg-purple-600" : "bg-gray-700 opacity-60"}`}>
                {showTrailer ? <X className="mr-2 w-5 h-5" /> : <Play className="mr-2 w-5 h-5" />} Watch {isLocal ? "Movie" : "Trailer"}
              </button>
              <button onClick={summarizeTrailer} disabled={isSummarizing} className="bg-linear-to-r from-purple-600 to-pink-900 px-5 py-3 rounded-full text-sm font-semibold">
                {isSummarizing ? "Analyzing..." : "AI Insight✨"}
              </button>
              <button onClick={() => setShowComments(!showComments)} className="px-4 py-3 rounded-full text-sm bg-purple-700">
                {showComments ? "Hide Comments" : "Comments"}
              </button>
              <button onClick={() => navigate(`/book/${id}`)} className="px-6 py-3 rounded-full text-sm font-bold bg-linear-to-r from-purple-900 via-purple-500 to-indigo-900">
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={trailerRef} className="px-8">
        {showTrailer && trailerKey && (
          <div className="max-w-5xl mx-auto -mt-10 mb-10 border border-purple-500/20 bg-black rounded-2xl overflow-hidden">
            {isLocal ? (
              <video src={trailerKey} controls autoPlay className="w-full h-full" />
            ) : (
              <div className="relative pt-[56.25%]">
                <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${trailerKey}?rel=0`} allowFullScreen />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="bg-[#232323] rounded-xl p-6">
          {trailerInsight && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InsightCard title="🎭 Tone" value={trailerInsight.tone} />
              <InsightCard title="⚡ Pace" value={trailerInsight.pace} />
              <InsightCard title="🎬 Vibe" value={trailerInsight.vibe} />
              <InsightCard title="👀 Best For" value={trailerInsight.audience} />
              <p className="sm:col-span-2 text-gray-300 text-sm mt-4">{trailerInsight.story}</p>
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} className="w-full bg-[#232323] p-3 rounded mb-3" placeholder="Write a comment..." />
          <button onClick={handlePostComment} className="bg-purple-600 px-4 py-2 rounded">Post</button>
          <div className="mt-6 space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="border-b border-gray-700 pb-2">
                <span className="font-semibold">{c.username}:</span> {c.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLocal && recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <Link key={rec.id} to={`/movie/${rec.id}`} className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition">
                <img src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`} className="w-full h-48 object-cover" alt={rec.title} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InsightCard = ({ title, value }) => (
  <div className="bg-[#1f1f1f] p-4 rounded-xl border border-purple-500/30">
    <span className="text-purple-400 font-semibold">{title}</span>
    <p className="text-gray-300 mt-1 text-sm">{value}</p>
  </div>
);

export default Moviepage;