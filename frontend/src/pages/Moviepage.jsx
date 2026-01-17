// import { Play } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router";

// const Moviepage = () => {
//   const { id } = useParams();

//   const [movie, setMovie] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);
//   const [trailerKey, setTrailerKey] = useState(null);

//   // AI Trailer Insight (experience-based, NOT plot-based)
//   const [trailerInsight, setTrailerInsight] = useState(null);
//   const [isSummarizing, setIsSummarizing] = useState(false);

//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NjkzNTQ3Y2EwZTRjMDZiZGFjM2I0MWIxMzVkMjQ2ZCIsIm5iZiI6MTc2ODE1ODUxMi4wMiwic3ViIjoiNjk2M2Y1MzA2MzcxMmRiMWQ0OTBkMTkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TwbgPEkR1KYwKlu38XRpc6zhLpvEoKw3ipDWcKORoLQ",
//     },
//   };

//   useEffect(() => {
//     setTrailerInsight(null);

//     fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
//       .then((res) => res.json())
//       .then(setMovie)
//       .catch(console.error);

//     fetch(
//       `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
//       options
//     )
//       .then((res) => res.json())
//       .then((res) => setRecommendations(res.results || []))
//       .catch(console.error);

//     fetch(
//       `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
//       options
//     )
//       .then((res) => res.json())
//       .then((res) => {
//         const trailer = res.results?.find(
//           (v) => v.site === "YouTube" && v.type === "Trailer"
//         );
//         setTrailerKey(trailer?.key || null);
//       })
//       .catch(console.error);
//   }, [id]);

//   const summarizeTrailer = async () => {
//     if (isSummarizing || !movie) return;
//     setIsSummarizing(true);

//     try {
//       const prompt = `
// Describe how this trailer FEELS to watch.
// Do NOT explain the plot.
// Focus on emotion, energy, pacing, and cinematic promise.
// Spoiler-free.

// Text:
// "${movie.overview}"
// `;

//       const { getAIRecommendation } = await import("../lib/AIModel");
//       const aiText = await getAIRecommendation(prompt);

//       if (aiText) {
//         setTrailerInsight({
//           tone: "Energetic & Quirky",
//           pace: "Fast-paced ⚡",
//           vibe: movie.genres.map((g) => g.name).slice(0, 3).join(", "),
//           audience:
//             "Perfect for viewers who enjoy adventurous stories with humor and heart.",
//           story: aiText.replace(/```/g, "").trim(),
//         });
//         setIsSummarizing(false);
//         return;
//       }
//     } catch {}

//     // 🔁 EXPERIENCE-BASED FALLBACK (NO PLOT)
//     setTrailerInsight({
//       tone:
//         movie.vote_average > 7.5
//           ? "High-energy & Feel-good"
//           : movie.vote_average > 6
//           ? "Fun & Entertaining"
//           : "Light & Casual",

//       pace:
//         movie.runtime < 100
//           ? "Fast-paced ⚡"
//           : movie.runtime < 130
//           ? "Balanced ⏱"
//           : "Slow-burn 🔥",

//       vibe: movie.genres.map((g) => g.name).slice(0, 3).join(", "),

//       audience:
//         "Great for viewers who enjoy visually rich, adventurous cinema.",

//       story: `The trailer doesn’t focus on explaining the story — instead, it
// pulls you into a feeling. It opens with playful energy and visual flair, quickly
// setting a light, humorous tone. As the pacing increases, the music and editing
// build momentum, promising moments of excitement, freedom, and surprise.

// Rather than revealing plot details, the trailer sells an experience: the thrill
// of breaking rules, stepping out of the ordinary, and embracing something bigger.
// It feels fast, colorful, and uplifting — the kind of trailer that leaves you
// energized and curious, ready for a fun cinematic ride.`,
//     });

//     setIsSummarizing(false);
//   };

//   if (!movie) {
//     return (
//       <div className="flex items-center justify-center h-screen text-purple-500">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#181818] text-white">
//       {/* HERO */}
//       <div
//         className="relative h-[60vh]"
//         style={{
//           backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

//         <div className="relative z-10 flex items-end p-8 gap-8">
//           <img
//             src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
//             className="rounded-lg shadow-lg w-48 hidden md:block"
//           />

//           <div>
//             <h1 className="text-4xl font-bold">{movie.title}</h1>

//             <div className="flex gap-4 mt-2 text-sm">
//               <span>⭐ {movie.vote_average.toFixed(1)}</span>
//               <span>{movie.release_date}</span>
//               <span>{movie.runtime} min</span>
//             </div>

//             <div className="flex flex-wrap gap-2 mt-3">
//               {movie.genres.map((g) => (
//                 <span
//                   key={g.id}
//                   className="bg-gray-800 px-3 py-1 rounded-full text-sm"
//                 >
//                   {g.name}
//                 </span>
//               ))}
//             </div>

//             <p className="max-w-2xl mt-4 text-gray-200">
//               {movie.overview}
//             </p>

//             <div className="flex gap-3 mt-5">
//               <Link
//                 to={`https://www.youtube.com/watch?v=${trailerKey}`}
//                 target="_blank"
//               >
//                 <button className="flex items-center bg-purple-700 px-4 py-3 rounded-full text-sm">
//                   <Play className="mr-2 w-5 h-5" />
//                   Watch Now
//                 </button>
//               </Link>

//               <button
//                 onClick={summarizeTrailer}
//                 disabled={isSummarizing}
//                 className={`px-4 py-3 rounded-full text-sm ${
//                   isSummarizing
//                     ? "bg-gray-600"
//                     : "bg-purple-900 hover:bg-purple-800"
//                 }`}
//               >
//                 {isSummarizing ? "Analyzing..." : "AI Trailer Insight"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* DETAILS */}
//       <div className="p-8">
//         <h2 className="text-2xl font-semibold mb-4">Details</h2>

//         <div className="bg-[#232323] rounded-xl p-6">
//           <h3 className="font-semibold mb-2">Overview</h3>
//           <p className="text-gray-300">{movie.overview}</p>

//           {trailerInsight && (
//             <>
//               <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
//                 🤖 AI Trailer Insight
//               </div>

//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <InsightCard title="🎭 Tone" value={trailerInsight.tone} />
//                 <InsightCard title="⚡ Pace" value={trailerInsight.pace} />
//                 <InsightCard title="🎬 Vibe" value={trailerInsight.vibe} />
//                 <InsightCard title="👀 Best For" value={trailerInsight.audience} />
//               </div>

//               {/* EXPERIENCE-BASED STORY */}
//               <div className="mt-6 bg-[#1f1f1f] p-5 rounded-xl border border-purple-500/30">
//                 <h4 className="text-purple-400 font-semibold mb-3">
//                   🎬 Trailer Summary
//                 </h4>

//                 <p className="text-gray-300 text-sm leading-relaxed">
//                   {trailerInsight.story}
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* RECOMMENDATIONS */}
//       {recommendations.length > 0 && (
//         <div className="p-8">
//           <h2 className="text-2xl font-semibold mb-4">
//             You might also like...
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {recommendations.slice(0, 10).map((rec) => (
//               <Link
//                 key={rec.id}
//                 to={`/movie/${rec.id}`}
//                 className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
//               >
//                 <img
//                   src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-2">
//                   <h3 className="text-sm font-semibold">{rec.title}</h3>
//                   <span className="text-xs text-gray-400">
//                     {rec.release_date?.slice(0, 4)}
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const InsightCard = ({ title, value }) => (
//   <div className="bg-[#1f1f1f] p-4 rounded-xl border border-purple-500/30">
//     <span className="text-purple-400 font-semibold">{title}</span>
//     <p className="text-gray-300 mt-1 text-sm">{value}</p>
//   </div>
// );

// export default Moviepage;

import { Play, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";

const Moviepage = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  // ✅ Embedded trailer state
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerRef = useRef(null);

  // AI Trailer Insight (experience-based, NOT plot-based)
  const [trailerInsight, setTrailerInsight] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NjkzNTQ3Y2EwZTRjMDZiZGFjM2I0MWIxMzVkMjQ2ZCIsIm5iZiI6MTc2ODE1ODUxMi4wMiwic3ViIjoiNjk2M2Y1MzA2MzcxMmRiMWQ0OTBkMTkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TwbgPEkR1KYwKlu38XRpc6zhLpvEoKw3ipDWcKORoLQ",
    },
  };

  useEffect(() => {
    setTrailerInsight(null);
    setShowTrailer(false); // close trailer when movie changes

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch(console.error);

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        const vids = res.results || [];
        const trailer =
          vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          vids.find((v) => v.site === "YouTube" && v.type === "Teaser");
        setTrailerKey(trailer?.key || null);
      })
      .catch(console.error);
  }, [id]);

  const toggleTrailer = () => {
    if (!trailerKey) return;
    setShowTrailer((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => {
          trailerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 0);
      }
      return next;
    });
  };

  const summarizeTrailer = async () => {
    if (isSummarizing || !movie) return;
    setIsSummarizing(true);

    try {
      const prompt = `
Describe how this trailer FEELS to watch.
Do NOT explain the plot.
Focus on emotion, energy, pacing, and cinematic promise.
Spoiler-free.

Text:
"${movie.overview}"
`;

      const { getAIRecommendation } = await import("../lib/AIModel");
      const aiText = await getAIRecommendation(prompt);

      if (aiText) {
        setTrailerInsight({
          tone: "Energetic & Quirky",
          pace: "Fast-paced ⚡",
          vibe: movie.genres.map((g) => g.name).slice(0, 3).join(", "),
          audience:
            "Perfect for viewers who enjoy adventurous stories with humor and heart.",
          story: aiText.replace(/```/g, "").trim(),
        });
        setIsSummarizing(false);
        return;
      }
    } catch {}

    // EXPERIENCE-BASED FALLBACK (NO PLOT)
    setTrailerInsight({
      tone:
        movie.vote_average > 7.5
          ? "High-energy & Feel-good"
          : movie.vote_average > 6
          ? "Fun & Entertaining"
          : "Light & Casual",

      pace:
        movie.runtime < 100
          ? "Fast-paced ⚡"
          : movie.runtime < 130
          ? "Balanced ⏱"
          : "Slow-burn 🔥",

      vibe: movie.genres.map((g) => g.name).slice(0, 3).join(", "),

      audience: "Great for viewers who enjoy visually rich, adventurous cinema.",

      story: `The trailer doesn’t focus on explaining the story — instead, it
pulls you into a feeling. It opens with playful energy and visual flair, quickly
setting a light, humorous tone. As the pacing increases, the music and editing
build momentum, promising moments of excitement, freedom, and surprise.

Rather than revealing plot details, the trailer sells an experience: the thrill
of breaking rules, stepping out of the ordinary, and embracing something bigger.
It feels fast, colorful, and uplifting — the kind of trailer that leaves you
energized and curious, ready for a fun cinematic ride.`,
    });

    setIsSummarizing(false);
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen text-purple-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* HERO */}
      <div
        className="relative h-[60vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

        <div className="relative z-10 flex items-end p-8 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
            alt={movie.title}
          />

          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="flex gap-4 mt-2 text-sm">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="max-w-2xl mt-4 text-gray-200">{movie.overview}</p>

            <div className="flex gap-3 mt-5 flex-wrap">
              {/* ✅ Embedded trailer toggle button */}
              <button
                onClick={toggleTrailer}
                disabled={!trailerKey}
                className={`flex items-center px-4 py-3 rounded-full text-sm ${
                  trailerKey
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-gray-700 opacity-70 cursor-not-allowed"
                }`}
              >
                {showTrailer ? (
                  <>
                    <X className="mr-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-5 h-5" />
                    Watch Trailer
                  </>
                )}
              </button>

              {/* Optional: keep external YouTube link
              {trailerKey && (
                <Link
                  to={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  className="self-center text-sm text-gray-300 underline"
                >
                  Open on YouTube
                </Link>
              )} */}

              <button
                onClick={summarizeTrailer}
                disabled={isSummarizing}
                className={`px-4 py-3 rounded-full text-sm ${
                  isSummarizing
                    ? "bg-gray-600"
                    : "bg-purple-900 hover:bg-purple-800"
                }`}
              >
                {isSummarizing ? "Analyzing..." : "AI Trailer Insight"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ EMBEDDED TRAILER BELOW BANNER */}
<div ref={trailerRef} className="px-8">
  {showTrailer && trailerKey && (
    <div className="max-w-5xl mx-auto -mt-10 mb-10">
      {/* wrapper MUST be relative + overflow-visible so button can sit outside */}
      <div className="relative overflow-visible">
        {/* Purple close button OUTSIDE (top-left) */}
        <button
          onClick={() => setShowTrailer(false)}
          aria-label="Close trailer"
          className="absolute -top-4 -left-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 hover:bg-purple-600 shadow-lg"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Trailer card */}
        <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-black shadow-xl">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="YouTube trailer"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  )}
</div>


      {/* DETAILS */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>

        <div className="bg-[#232323] rounded-xl p-6">
           <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Status: </span>
                <span className="ml-2">{movie.status}</span>
              </li>

              <li>
                <span className="font-semibold text-white">Release Date: </span>
                <span className="ml-2">{movie.release_date}</span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Original Language:
                </span>
                <span className="ml-2">
                  {movie.original_language?.toUpperCase()}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Budget: </span>
                <span className="ml-2">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Revenue:</span>{" "}
                <span className="ml-2">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Production Companies:
                </span>
                <span className="ml-2">
                  {movie.production_companies &&
                  movie.production_companies.length > 0
                    ? movie.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Countries:</span>
                <span className="ml-2">
                  {movie.production_countries &&
                  movie.production_countries.length > 0
                    ? movie.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Spoken Languages:
                </span>
                <span className="ml-2">
                  {movie.spoken_languages && movie.spoken_languages.length > 0
                    ? movie.spoken_languages
                        .map((l) => l.english_name)
                        .join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {movie.tagline || "No tagline available."}
            </p>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movie.overview}</p>
          </div>
        

      

          {trailerInsight && (
            <>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                🤖 AI Trailer Insight
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InsightCard title="🎭 Tone" value={trailerInsight.tone} />
                <InsightCard title="⚡ Pace" value={trailerInsight.pace} />
                <InsightCard title="🎬 Vibe" value={trailerInsight.vibe} />
                <InsightCard
                  title="👀 Best For"
                  value={trailerInsight.audience}
                />
              </div>

              <div className="mt-6 bg-[#1f1f1f] p-5 rounded-xl border border-purple-500/30">
                <h4 className="text-purple-400 font-semibold mb-3">
                  🎬 Trailer Summary
                </h4>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {trailerInsight.story}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            You might also like...
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <Link
                key={rec.id}
                to={`/movie/${rec.id}`}
                className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  className="w-full h-48 object-cover"
                  alt={rec.title}
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold">{rec.title}</h3>
                  <span className="text-xs text-gray-400">
                    {rec.release_date?.slice(0, 4)}
                  </span>
                </div>
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
