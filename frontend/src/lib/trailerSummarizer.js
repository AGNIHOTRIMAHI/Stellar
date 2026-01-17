import { getAIRecommendation } from "./AIModel";

/**
 * Try AI first, fallback to rule-based summary
 */
export const getTrailerSummary = async (movie, trailerText) => {
  // 1️⃣ Try AI
  try {
    const prompt = `
You are a movie expert.

Summarize the following movie trailer in 3–4 short lines.
Rules:
- NO spoilers
- Focus on tone, pace, and vibe
- Mention what type of viewer will enjoy it

Trailer description:
"${trailerText}"
`;

    const result = await getAIRecommendation(prompt);

    if (result) {
      return cleanAIText(result);
    }
  } catch (err) {
    console.error("AI summary failed:", err);
  }

  // 2️⃣ Fallback (always works)
  return fallbackSummary(movie);
};

/**
 * Clean AI response
 */
const cleanAIText = (text) => {
  return text
    .replace(/```/g, "")
    .replace(/\n+/g, " ")
    .trim();
};

/**
 * Rule-based fallback summary
 */
const fallbackSummary = (movie) => {
  const pace =
    movie.runtime && movie.runtime < 100
      ? "fast-paced"
      : movie.runtime && movie.runtime < 130
      ? "moderately paced"
      : "slow-burn";

  const tone =
    movie.vote_average > 7.5
      ? "critically acclaimed"
      : movie.vote_average > 6
      ? "entertaining"
      : "light and casual";

  const genres = movie.genres
    ? movie.genres.map((g) => g.name).join(", ")
    : "genre-blending";

  return `This is a ${pace}, ${tone} ${genres} movie.
It focuses more on mood and visuals than heavy storytelling.
Best suited for viewers who enjoy ${genres.toLowerCase()} films.`;
};
