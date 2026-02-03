import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Sun,
  Moon,
  Sparkles,
  Heart,
  Bookmark,
  AlertCircle,
  X,
} from "lucide-react";
import Loader from "../Components/Loader";

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
    color: "bg-[#113CCF]",
  },
  Hulu: {
    color: "bg-[#1CE783]",
  },
  HBO: {
    color: "bg-[#91521A]",
  },
  HBOMax: {
    color: "bg-[#5B22A5]",
  },
  AppleTV: {
    color: "bg-black",
  },
  Peacock: {
    color: "bg-[#010101]",
  },
  ParamountPlus: {
    color: "bg-[#004B87]",
  },
  Crunchyroll: {
    color: "bg-[#F67500]",
  },
  Spotify: {
    color: "bg-[#1DB954]",
  },
  SoundCloud: {
    color: "bg-[#FF8800]",
  },
  Tubi: {
    color: "bg-[#00AEEF]",
  },
  Sling: {
    color: "bg-[#EE2B24]",
  },
  Starz: {
    color: "bg-[#FFDB00]",
  },
  Paramount: {
    color: "bg-[#004B87]",
  },
  Vudu: {
    color: "bg-[#2C5AA0]",
  },
  Disney: {
    color: "bg-[#0070E0]",
  },
  AppleMusic: {
    color: "bg-[#FA233B]",
  },
  PeacockTV: {
    color: "bg-[#00B0E3]",
  },
};

// const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL
const CACHE_KEY = "moviefinder_saved_movies";
const POLL_INTERVAL = 12000; // 9 seconds

export default function FindMovie() {
  const [theme, setTheme] = useState("dark");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, movieIndex: null });
  const navigate = useNavigate();

  // Load saved movies from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setSavedMovies(JSON.parse(cached));
      } catch (e) {
        console.error("Error loading cached movies:", e);
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Save movies to cache whenever savedMovies changes
  const updateCache = (movies) => {
    setSavedMovies(movies);
    localStorage.setItem(CACHE_KEY, JSON.stringify(movies));
  };

  // Poll status endpoint
  const pollJobStatus = async (jobId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: jobId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "done") {
        if (data.result && data.result.original_title) {
          // Movie found successfully
          const movieData = {
            image: data.result.poster_path,
            title: data.result.title,
            originalTitle: data.result.original_title,
            Desc: data.result.overview,
            Year: data.result.release_date?.split("-")[0] || "N/A",
            runtime: data.result.runtime,
            genres: data.result.genres,
            voteAverage: data.result.vote_average,
            tagline: data.result.tagline,
            imdbId: data.result.imdb_id,
            aiConfidence: data.result.ai_confidence,
            WTW: [], // You can map this from your backend if available
            backdropPath: data.result.backdrop_path,
          };

          setResult([movieData]);
          setLoading(false);
          setError(null);
        } else {
          // Movie not found
          setError("Movie not found. Please try a different clip.");
          setResult([]);
          setLoading(false);
        }
      } else if (data.status === "processing") {
        // Still processing, poll again after interval
        setTimeout(() => pollJobStatus(jobId), POLL_INTERVAL);
      } else if (data.status === "error") {
        // Handle error status from backend
        const errorMessage = data.error || data.message || "An error occurred while analyzing the video.";
        setError(errorMessage);
        setResult([]);
        setLoading(false);
      } else {
        // Unknown status
        setError(`Unexpected status received: ${data.status}`);
        setResult([]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error polling job status:", err);
      setError(`Failed to check analysis status: ${err.message}`);
      setLoading(false);
    }
  };

  // Handle movie identification
  const handleIdentify = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResult([]);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiktok_url: urlInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.job_id) {
        // Start polling for results
        pollJobStatus(data.job_id);
      } else {
        throw new Error("No job ID received from server");
      }
    } catch (err) {
      console.error("Error starting analysis:", err);
      setError(`Failed to analyze video: ${err.message}`);
      setLoading(false);
    }
  };

  // Toggle bookmark for a movie in results
  const toggleBookmark = (movieImdbId) => {
    const movie = result[0];
    if (!movie) return;

    const existingIndex = savedMovies.findIndex(
      (m) => m.imdbId === movieImdbId
    );

    let updatedSaved = [...savedMovies];
    if (existingIndex > -1) {
      // Remove from saved
      updatedSaved.splice(existingIndex, 1);
    } else {
      // Add to saved
      updatedSaved.unshift({
        title: movie.title,
        year: movie.Year,
        poster: movie.image,
        imdbId: movie.imdbId,
      });
    }

    updateCache(updatedSaved);
  };

  const isBookmarked = (imdbId) => {
    return savedMovies.some((m) => m.imdbId === imdbId);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (index) => {
    setDeleteModal({ show: true, movieIndex: index });
  };

  // Close delete modal
  const handleCancelDelete = () => {
    setDeleteModal({ show: false, movieIndex: null });
  };

  // Confirm and delete movie
  const handleConfirmDelete = () => {
    if (deleteModal.movieIndex !== null) {
      const updatedSaved = [...savedMovies];
      updatedSaved.splice(deleteModal.movieIndex, 1);
      updateCache(updatedSaved);
    }
    setDeleteModal({ show: false, movieIndex: null });
  };

  return (
    <div className="poppins-regular min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-[#0b0b12] dark:via-[#0f1020] dark:to-black text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-6">
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-3 font-bold text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
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

      {/* Main Content */}
      <section className="flex flex-col items-center justify-center px-4 md:px-4 py-12">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-5">
          {/* Left Section - Movie Identification Form */}
          <div className="flex-1 bg-white/70 dark:bg-[#111327]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="text-center md:text-left space-y-3 mb-8">
              <h2 className="text-xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Identify a movie instantly
              </h2>
              <p className="text-slate-600 text-sm md:text-base dark:text-slate-400 max-w-xl mx-auto md:mx-0">
                Paste a link from TikTok, Instagram Reels, or YouTube Shorts —
                we'll analyze the clip and find the movie.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleIdentify()}
                placeholder="https://tiktok.com/@user/video/..."
                className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition font-mono"
                disabled={loading}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                URL
              </span>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              className="mx-auto mt-6 flex items-center gap-2 rounded-xl py-3 px-6 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:scale-[1.05] transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleIdentify}
              disabled={loading || !urlInput.trim()}
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
            
            {/* Results Section */}
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
                      <div className="mr-auto">
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                          {movie.title}
                        </h3>
                        {movie.tagline && (
                          <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1">
                            "{movie.tagline}"
                          </p>
                        )}
                      </div>
                      <button
                        title={isBookmarked(movie.imdbId) ? "Remove" : "Save"}
                        onClick={() => toggleBookmark(movie.imdbId)}
                      >
                        <Bookmark
                          className={`size-12 p-3 rounded-full hover:bg-white/10 cursor-pointer transition`}
                          fill={isBookmarked(movie.imdbId) ? "#fafafa" : ""}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">{movie.Year}</span>
                      {movie.runtime && (
                        <>
                          <span>•</span>
                          <span>{movie.runtime} min</span>
                        </>
                      )}
                      {movie.voteAverage && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            ⭐ {movie.voteAverage.toFixed(1)}
                          </span>
                        </>
                      )}
                      {movie.aiConfidence && (
                        <>
                          <span>•</span>
                          <span className="text-pink-600 dark:text-pink-400">
                            {Math.round(movie.aiConfidence * 100)}% confidence
                          </span>
                        </>
                      )}
                    </div>

                    {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs tracking-widest font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        SYNOPSIS
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {movie.Desc}
                      </p>
                    </div>

                    {movie.WTW && movie.WTW.length > 0 && (
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
                    )}

                    {movie.imdbId && (
                      <a
                        href={`https://www.imdb.com/title/${movie.imdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
                      >
                        View on IMDb →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Saved Movies */}
          <div className="flex-1 bg-white/70 dark:bg-[#111327]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center justify-between py-3 border-b border-slate-300 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-300 dark:text-slate-400">
                Saved Movies
              </h3>
              <span className="text-sm text-slate-400 dark:text-slate-500">
                {savedMovies.length}
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {savedMovies.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No saved movies yet. Start by identifying a movie!
                </p>
              ) : (
                savedMovies.map((movie, index) => (
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
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition"
                      title="Delete"
                    >
                      <X className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111327] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Delete Movie
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {deleteModal.movieIndex !== null && savedMovies[deleteModal.movieIndex]?.title}
                  </span>{" "}
                  from your saved movies? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium hover:opacity-80 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-white py-4 mt-8 flex flex-col gap-2">
        <div className="container mx-auto flex md:flex-row justify-center items-center gap-2 md:gap-4 text-sm md:text-base">
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