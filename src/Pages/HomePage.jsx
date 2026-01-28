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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState("dark");
  const Icon = steps[currentStep].icon;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-[#0b0b12] dark:via-[#0f1020] dark:to-black text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 font-bold text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-xl">
          <Film className="h-5 w-5" />
          MovieFinder
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2 rounded-xl px-4 py-2 bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:opacity-80 transition"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>

      {/* Hero */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-14 px-8 py-20 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Discover Any Movie
            <span className="block mt-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-5 py-2 rounded-2xl w-fit shadow-lg">
              in Seconds
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
            Stop asking <span className="font-semibold text-slate-900 dark:text-white">“what movie is this?”</span>. Just share the clip and we’ll do the rest.
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

        {/* Steps Card */}
        <div className="relative">
          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= currentStep ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-700"}`}
                style={{ width: i === currentStep ? "100%" : "32px", flex: i === currentStep ? 1 : "unset" }}
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
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{steps[currentStep].title}</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{steps[currentStep].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between pt-8">
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
                    className={`h-2.5 rounded-full transition-all ${i === currentStep ? "w-8 bg-pink-500" : "w-2.5 bg-slate-400 dark:bg-slate-600"}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-[1.03] transition disabled:opacity-40"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
