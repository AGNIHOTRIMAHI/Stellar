/*import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getAIRecommendation } from "../lib/AIModel";
import RecommendedMovies from "../components/RecommendedMovies";

const steps = [
  {
    name: "genre",
    label: "What's your favorite genre?",
    options: [
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Animation",
    ],
  },
  {
    name: "mood",
    label: "What's your current mood?",
    options: [
      "Excited",
      "Relaxed",
      "Thoughtful",
      "Scared",
      "Inspired",
      "Romantic",
    ],
  },
  {
    name: "decade",
    label: "Preferred decade?",
    options: ["2020s", "2010s", "2000s", "1990s", "Older"],
  },
  {
    name: "language",
    label: "Preferred language?",
    options: ["English", "Korean", "Spanish", "French", "Other"],
  },
  {
    name: "length",
    label: "Preferred movie length?",
    options: ["Short (<90 min)", "Standard (90-120 min)", "Long (>120 min)"],
  },
];

const initialState = steps.reduce((acc, step) => {
  acc[step.name] = "";
  return acc;
}, {});

const AIRecommendations = () => {
  const [inputs, setInputs] = useState(initialState);
  const [step, setStep] = useState(0);
  const [recommendation, setRecommendation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOption = (value) => {
    setInputs({ ...inputs, [steps[step].name]: value });
    console.log(inputs);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log(inputs);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const generateRecommendations = async () => {
    if (!inputs) {
      toast("Please enter your inputs.");
    }

    setIsLoading(true);

    const userPrompt = `Given the following user inputs:

- Decade: ${inputs.decade}
- Genre: ${inputs.genre}
- Language: ${inputs.language}
- Length: ${inputs.length}
- Mood: ${inputs.mood}

Recommend 10 ${inputs.mood.toLowerCase()} ${
      inputs.language
    }-language ${inputs.genre.toLowerCase()} movies released in the ${
      inputs.decade
    } with a runtime between ${
      inputs.length
    }. Return the list as plain JSON array of movie titles only, No extra text, no explanations, no code blocks, no markdown, just the JSON array.
    example:
[
  "Movie Title 1",
  "Movie Title 2",
  "Movie Title 3",
  "Movie Title 4",
  "Movie Title 5",
  "Movie Title 6",
  "Movie Title 7",
  "Movie Title 8",
  "Movie Title 9",
  "Movie Title 10"
]`;

    const result = await getAIRecommendation(userPrompt);

    setIsLoading(false);

    if (result) {
      const cleanedResult = result
        .replace(/```json\n/i, "")
        .replace(/\n```/i, "");
      try {
        const recommendationArray = JSON.parse(cleanedResult);
        setRecommendation(recommendationArray);
        console.log(recommendationArray);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      toast.error("Failed to get recommendations.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] relative overflow-hidden">
      {!(recommendation && recommendation.length > 0) && (
        <img
          src="/background_banner.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px] "
        />
      )}

      {recommendation && recommendation.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto mt-2">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">AI Recommended Movies</h2>
          <RecommendedMovies movieTitles={recommendation} />
        </div>
      ) : (
        <div className="relative w-full max-w-md mx-auto rounded-2xl bg-[#181818]/90 shadow-2xl border border-[#333] px-8 py-10 mt-4 flex flex-col items-center min-h-[480px]">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight drop-shadow-lg">
            AI Movie Recommendation
          </h2>

          <div className="w-full flex items-center mb-8">
            <div className="flex-1 h-2 bg-[#232323] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e50914] transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            <span className="ml-4 text-white text-sm font-semibold">
              {step + 1}/{steps.length}
            </span>
          </div>

          <div className="w-full flex flex-col flex-1">
            <div className="mb-6 flex-1">
              <h3 className=" text-lg font-semibold text-white mb-6 text-center">
                {steps[step].label}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className={`w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-2 active:scale-95 duration-150 focus:ring-[#e50914] shadow-sm ${
                      inputs[steps[step].name] == opt
                        ? "bg-[#e50914] border-[#e50914] text-white shadow-lg"
                        : "bg-[#232323] border-[#444] text-white hover:bg-[#e50914]/80 hover:border-[#e50914]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step == 0}
                className="px-6 py-2 rounded-lg font-semibold transition border-2 border-[#444] text-white bg-[#181818] hover:bg-[#232323]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={
                  step === steps.length - 1
                    ? generateRecommendations
                    : handleNext
                }
                disabled={!inputs[steps[step].name] || isLoading}
                className="px-6 py-2 rounded-lg font-semibold transition border-2 border-[#e50914] text-white bg-[#e50914] hover:bg-[#b0060f] ml-2"
              >
                {step === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;*/

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getAIRecommendation } from "../lib/AIModel";
import RecommendedMovies from "../components/RecommendedMovies";

const steps = [
  { name: "genre", label: "What's your favorite genre?", options: ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Animation"] },
  { name: "mood", label: "What's your current mood?", options: ["Excited", "Relaxed", "Thoughtful", "Scared", "Inspired", "Romantic"] },
  { name: "decade", label: "Preferred decade?", options: ["2020s", "2010s", "2000s", "1990s", "Older"] },
  { name: "language", label: "Preferred language?", options: ["English", "Korean", "Spanish", "French", "Other"] },
  { name: "length", label: "Preferred movie length?", options: ["Short (<90 min)", "Standard (90-120 min)", "Long (>120 min)"] },
];

const initialState = { genre: "", mood: "", decade: "", language: "", length: "" };

const AIRecommendations = () => {
  const [inputs, setInputs] = useState(initialState);
  const [step, setStep] = useState(0);
  const [recommendation, setRecommendation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOption = (value) => {
    setInputs((prev) => ({ ...prev, [steps[step].name]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const generateRecommendations = async () => {
    if (isLoading) return; // Re-entry check

    setIsLoading(true);
    const loadingToast = toast.loading("AI is searching movies...");

    const userPrompt = `Return a JSON array of 10 movie titles. 
    Context: Genre ${inputs.genre}, Mood ${inputs.mood}, Decade ${inputs.decade}, Language ${inputs.language}, Length ${inputs.length}.
    Format: ["Movie 1", "Movie 2"]`;

    try {
      const result = await getAIRecommendation(userPrompt);
      if (result) {
        const cleanedResult = result.replace(/```json|```/gi, "").trim();
        setRecommendation(JSON.parse(cleanedResult));
        toast.success("Found some great movies!", { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      if (error.message?.includes("429")) {
        toast.error("Google's limit reached. Please wait 40-60 seconds.", { id: loadingToast });
      } else {
        toast.error("Connection error. Try again.", { id: loadingToast });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4">
      {recommendation.length > 0 ? (
        <div className="w-full max-w-7xl">
          <RecommendedMovies movieTitles={recommendation} />
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg mx-auto block">Try Again</button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#232323] p-8 rounded-2xl border border-gray-700 shadow-xl">
          <div className="mb-6 h-1.5 w-full bg-gray-800 rounded-full">
            <div className="h-full bg-purple-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
          </div>
          <h3 className="text-xl text-white font-bold mb-6 text-center">{steps[step].label}</h3>
          <div className="grid gap-3 mb-8">
            {steps[step].options.map((opt) => (
              <button 
                key={opt} 
                onClick={() => handleOption(opt)}
                className={`py-3 rounded-lg border transition ${inputs[steps[step].name] === opt ? "bg-purple-600 border-purple-700 text-white" : "bg-gray-800 border-gray-600 text-gray-300 hover:border-red-600"}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(step - 1)} disabled={step === 0 || isLoading} className="text-gray-400 disabled:opacity-30">Back</button>
            <button 
              onClick={step === steps.length - 1 ? generateRecommendations : handleNext} 
              disabled={!inputs[steps[step].name] || isLoading}
              className="bg-purple-600 px-8 py-2 rounded-lg text-white font-bold disabled:bg-gray-700"
            >
              {isLoading ? "Loading..." : step === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;