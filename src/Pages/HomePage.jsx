import { useState, useEffect } from "react";
import {
  Film,
  Share2,
  Zap,
  ChevronRight,
  ChevronLeft,
  Search,
  Sun,
  Moon,
  Sparkles,
  Heart,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DarkKnight from "../Images/dark_knight.jpg";
import inception from "../Images/inception.jpg";
import barbie from "../Images/barbie.jpg";
import oppenheimer from "../Images/oppenheimer.jpg";
import Interstellar from "../Images/Interstellar.jpg";
import Loader from "../Components/Loader";

const steps = [
  {
    icon: Film,
    title: "See a movie clip you like",
    description:
      "Scrolling TikTok, Reels, or YouTube Shorts and a scene catches your eye?",
  },
  {
    icon: Share2,
    title: "Share it with MovieFinder",
    description:
      "Share the clip directly to MovieFinder from your favorite platform.",
  },
  {
    icon: Zap,
    title: "Get the title instantly",
    description:
      "We identify the movie, show details, and tell you where to watch it.",
  },
];

const WTWProviders = {
  YouTube: {
    color: "bg-red-500",
  },
  Netflix: {
    color: "bg-[#E50914]",
  },
  Prime: {
    color: "bg-blue-600",
  },
  DisneyPlus: {
    color: "bg-[#113CCF]", // Disney+ blue
  },
  Hulu: {
    color: "bg-[#1CE783]", // Hulu green
  },
  HBO: {
    color: "bg-[#91521A]", // HBO brown-orange
  },
  HBOMax: {
    color: "bg-[#5B22A5]", // HBO Max purple
  },
  AppleTV: {
    color: "bg-black", // Apple TV
  },
  Peacock: {
    color: "bg-[#010101]", // Peacock black
  },
  ParamountPlus: {
    color: "bg-[#004B87]", // Paramount+ blue
  },
  Crunchyroll: {
    color: "bg-[#F67500]", // Crunchyroll orange
  },
  Spotify: {
    color: "bg-[#1DB954]", // Spotify green
  },
  SoundCloud: {
    color: "bg-[#FF8800]", // SoundCloud orange
  },
  Tubi: {
    color: "bg-[#00AEEF]", // Tubi cyan
  },
  Sling: {
    color: "bg-[#EE2B24]", // Sling red
  },
  Starz: {
    color: "bg-[#FFDB00]", // Starz yellow
  },
  Paramount: {
    color: "bg-[#004B87]", // Paramount blue
  },
  Vudu: {
    color: "bg-[#2C5AA0]", // Vudu blue
  },
  Disney: {
    color: "bg-[#0070E0]", // Disney blue
  },
  AppleMusic: {
    color: "bg-[#FA233B]", // Apple Music red
  },
  PeacockTV: {
    color: "bg-[#00B0E3]", // Peacock cyan
  },
};

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [urlInput, setUrlInput] = useState("");
  const Icon = steps[currentStep].icon;
  const [bookmark, setBookMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleIdentify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000); 
  };

  // Simulated API result
  const result = [
    {
      image: DarkKnight,
      title: "The Dark Knight",
      Desc: "Batman takes on the Joker, a criminal mastermind whose reign of chaos threatens Gotham City and tests the limits of justice.",
      WTW: ["HBO", "Netflix", "Prime"],
      Year: "2008",
    },
  ];

  const recentSearches = [
    { title: "Inception", year: "2010", poster: inception },
    { title: "Oppenheimer", year: "2008", poster: oppenheimer },
    { title: "Interstellar", year: "2014", poster: Interstellar },
    { title: "Barbie", year: "2014", poster: barbie },
  ];

  return (
    <div className="poppins-regular min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-[#0b0b12] dark:via-[#0f1020] dark:to-black text-slate-900 dark:text-slate-100">
      <nav className="flex items-center justify-between px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 font-bold text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-xl">
          <Film className="h-5 w-5" />
          MovieFinder
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2 rounded-full p-3 bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:opacity-80 transition"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </nav>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-14 px-4 md:px-8 py-20 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Discover Any Movie
            <span className="block mt-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-5 py-2 rounded-2xl w-fit shadow-lg">
              in Seconds
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
            Stop asking{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              “what movie is this?”
            </span>
            . Just share the clip, Discover the movie name, details and where to watch it in seconds.
          </p>

          <div className="flex gap-4 pt-2">
            <button className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-[1.03] transition">
              <Search className="h-5 w-5" />
              Find a Movie
            </button>
            <button className="rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              How it works
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= currentStep ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-700"}`}
                style={{
                  width: i === currentStep ? "100%" : "32px",
                  flex: i === currentStep ? 1 : "unset",
                }}
              />
            ))}
          </div>
          <div className="bg-white/80 dark:bg-[#111327]/80 backdrop-blur rounded-3xl shadow-2xl p-10 min-h-[420px] flex flex-col justify-between border border-slate-200 dark:border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="inline-flex p-5 rounded-2xl text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-xl">
                  <Icon className="w-14 h-14" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === currentStep
                        ? "w-8 bg-pink-500"
                        : "w-2.5 bg-slate-400 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
                }
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-[1.03] transition disabled:opacity-40"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <section className="flex flex-col items-center justify-center px-4 md:px-4 mt-12">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-5">
          <div className="flex-1 bg-white/70 dark:bg-[#111327]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="text-center md:text-left space-y-3 mb-8">
              <h2 className="text-xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Identify a movie instantly
              </h2>
              <p className="text-slate-600 text-sm md:text-base dark:text-slate-400 max-w-xl mx-auto md:mx-0">
                Paste a link from TikTok, Instagram Reels, or YouTube Shorts —
                we’ll analyze the clip and find the movie.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://tiktok.com/@user/video/..."
                className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                URL
              </span>
            </div>
            <button
              className="mx-auto mt-6 flex items-center gap-2 rounded-xl py-3 px-6 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:scale-[1.05] transition"
              onClick={handleIdentify}
              disabled={loading}
            >
              {loading ? (
                <div className="flex gap-2 items-center">
                  <span>Analyzing Video</span>
                  <Loader />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Identify Movie</span>
                </div>
              )}
            </button>

            {result.length > 0 && (
              <div className="w-full border-t border-slate-200 dark:border-slate-700 my-8" />
            )}
            <div className="space-y-8">
              {result.map((movie, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
                >
                  <div className="md:col-span-1">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full rounded-2xl shadow-lg object-cover"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center">
                      <h3 className="text-2xl mr-auto font-semibold text-slate-900 dark:text-white">
                        {movie.title}
                      </h3>
                      <button title="Save">
                        <Bookmark
                          onClick={() => setBookMarked(!bookmark)}
                          className={`size-12 p-3 rounded-full hover:bg-white/10 cursor-pointer`}
                          fill={bookmark ? "#fafafa" : ""}
                        />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xs tracking-widest font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        SYNOPSIS
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {movie.Desc}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs tracking-widest font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        WHERE TO WATCH
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {movie.WTW.map((where, idx) => {
                          const Provider = WTWProviders[where];
                          if (!Provider) return null;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-4 py-2 rounded-3xl mt-3 text-white ${Provider.color}`}
                            >
                              <Film className="w-4 h-4" strokeWidth={2} />
                              <span className="text-sm">{where}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white/70 dark:bg-[#111327]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center justify-between py-3 border-b border-slate-300 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-300 dark:text-slate-400">
                Saved Movies
              </h3>
              <span className="text-sm text-slate-400 dark:text-slate-500">
                {recentSearches.length}
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {recentSearches.map((movie, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-[#111327]/70 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-20 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="font-medium text-slate-900 dark:text-white text-lg truncate">
                      {movie.title}
                    </span>
                    {movie.year && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {movie.year}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="text-white py-4 mt-8 flex flex-col gap-2">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-sm md:text-base">
          <span>Made with</span>
          <Heart className="w-5 h-5 text-red-500 animate-pulse" />
          <span>by Group F</span>
        </div>
        <div className="text-gray-400 text-xs mt-2 md:mt-1 text-center">
          &copy; {new Date().getFullYear()} Group F. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
