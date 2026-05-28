import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  ArrowRight, 
  Medal, 
  Flame, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Award
} from 'lucide-react';
import { Link } from 'react-router';
import { useColorModeValue } from '@chakra-ui/react';

// Mock Contest Data
const INITIAL_CONTESTS = [
  {
    id: "contest_1",
    title: "Haveli Code Sprint #15",
    description: "Our signature bi-weekly challenge. Solve 5 algorithmic problems in 2 hours. Top 3 win premium CoderHaveli badges!",
    status: "running", // running, upcoming, past
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // Ends in 2h 45m
    duration: "120 Mins",
    registeredCount: 842,
    questionsCount: 5,
    totalPoints: 500,
    prize: "Premium Badges + 50 XP",
  },
  {
    id: "contest_2",
    title: "Weekend Algorithmic Clash #4",
    description: "Challenge your logic and data structure speed. 4 problems ranging from Easy to Hard. Highly rated by the community.",
    status: "upcoming",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // Starts in 27 hours
    duration: "90 Mins",
    registeredCount: 412,
    questionsCount: 4,
    totalPoints: 400,
    prize: "100 XP + Top Rank Certificates",
  },
  {
    id: "contest_3",
    title: "Beginner Friendly Contest #8",
    description: "New to programming? Practice your syntax and basics in this easy-going competitive atmosphere. Mentors will be active in chat.",
    status: "upcoming",
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 4 days
    duration: "150 Mins",
    registeredCount: 1205,
    questionsCount: 6,
    totalPoints: 300,
    prize: "20 XP for participation",
  },
  {
    id: "contest_4",
    title: "Haveli Summer Hackathon 2026",
    description: "Our annual grand coding championship. 8 advanced problems, open-ended optimizations, and huge leaderboard rewards.",
    status: "upcoming",
    startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 15 days
    duration: "240 Mins",
    registeredCount: 2310,
    questionsCount: 8,
    totalPoints: 1000,
    prize: "CoderHaveli Hoodie + 200 XP",
  },
];

const PAST_CONTESTS = [
  {
    id: "past_1",
    title: "Haveli Code Sprint #14",
    date: "May 24, 2026",
    participants: 1250,
    questionsCount: 5,
    winner: "akash_codes",
    topScore: "480/500",
  },
  {
    id: "past_2",
    title: "Data Structures Decoded #3",
    date: "May 18, 2026",
    participants: 940,
    questionsCount: 4,
    winner: "priya_dev",
    topScore: "400/400",
  },
  {
    id: "past_3",
    title: "Monthly Mega Contest #5",
    date: "April 30, 2026",
    participants: 3420,
    questionsCount: 7,
    winner: "zen_programmer",
    topScore: "675/700",
  },
  {
    id: "past_4",
    title: "Dynamic Programming Drill #1",
    date: "April 15, 2026",
    participants: 1105,
    questionsCount: 5,
    winner: "dp_wizard",
    topScore: "500/500",
  },
];

const LEADERBOARD_MOCK = [
  { rank: 1, name: "akash_codes", rating: 2854, ratingChange: 42, solved: 342, avatar: "AC", color: "from-amber-400 to-amber-500" },
  { rank: 2, name: "zen_programmer", rating: 2712, ratingChange: 15, solved: 298, avatar: "ZP", color: "from-indigo-400 to-indigo-500" },
  { rank: 3, name: "dp_wizard", rating: 2690, ratingChange: -8, solved: 312, avatar: "DW", color: "from-purple-400 to-purple-500" },
  { rank: 4, name: "priya_dev", rating: 2548, ratingChange: 29, solved: 265, avatar: "PD", color: "from-emerald-400 to-emerald-500" },
  { rank: 5, name: "codeninja_99", rating: 2490, ratingChange: -12, solved: 278, avatar: "CN", color: "from-rose-400 to-rose-500" },
  { rank: 6, name: "binary_boss", rating: 2415, ratingChange: 3, solved: 224, avatar: "BB", color: "from-blue-400 to-blue-500" },
  { rank: 7, name: "sharma_prashant", rating: 2398, ratingChange: 54, solved: 198, avatar: "SP", color: "from-cyan-400 to-cyan-500" },
  { rank: 8, name: "neha_coder", rating: 2310, ratingChange: 11, solved: 215, avatar: "NC", color: "from-pink-400 to-pink-500" },
  { rank: 9, name: "stack_overflowed", rating: 2280, ratingChange: -24, solved: 187, avatar: "SO", color: "from-teal-400 to-teal-500" },
  { rank: 10, name: "haveli_pro", rating: 2245, ratingChange: 18, solved: 165, avatar: "HP", color: "from-violet-400 to-violet-500" },
];

export default function Contest() {
  const [activeTab, setActiveTab] = useState("active"); // active, past, leaderboard
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredContests, setRegisteredContests] = useState([]);
  const [contests, setContests] = useState(INITIAL_CONTESTS);

  // Next Featured Contest (e.g. Haveli Code Sprint #15 or Weekend Algorithmic Clash)
  const featuredContest = contests.find(c => c.status === "running") || contests[0];

  const handleRegister = (contestId) => {
    if (registeredContests.includes(contestId)) return;
    setRegisteredContests(prev => [...prev, contestId]);
  };

  // Live ticking countdown for the featured contest
  const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
          newTimeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
        setTimeLeft(newTimeLeft);
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
  };

  const countdown = useCountdown(featuredContest?.startTime);

  const filteredContests = contests.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-24 left-1/3 w-64 h-64 bg-amber-100/20 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-24 right-1/4 w-80 h-80 bg-amber-200/10 dark:bg-purple-900/10 rounded-full blur-3xl -z-10"></div>

      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white flex items-center justify-center sm:justify-start gap-3">
            <Trophy className="w-8 h-8 text-amber-500 dark:text-indigo-400 animate-pulse" />
            <span>CoderHaveli Contests</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Challenge yourself with algorithms, climb the rankings, and become a master coder.
          </p>
        </div>
        
        {/* Quick Stats Header */}
        <div className="flex gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Platform Peak</div>
              <div className="text-sm font-bold text-gray-800 dark:text-white">4.2k Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured / Hero Contest Section (Countdown Timer) */}
      {featuredContest && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 overflow-hidden relative rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-gray-800 dark:to-gray-900/80 border border-amber-200 dark:border-gray-700 p-6 md:p-8 shadow-lg"
        >
          {/* Status Badge */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
              ${featuredContest.status === "running" 
                ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 animate-pulse" 
                : "bg-amber-100 text-amber-800 dark:bg-indigo-950/40 dark:text-indigo-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${featuredContest.status === "running" ? "bg-red-500" : "bg-amber-500 dark:bg-indigo-400"}`} />
              {featuredContest.status === "running" ? "Running Now" : "Featured Contest"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Contest Info */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                {featuredContest.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {featuredContest.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs md:text-sm font-medium">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                  <span>Duration: {featuredContest.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                  <span>{featuredContest.registeredCount + (registeredContests.includes(featuredContest.id) ? 1 : 0)} Registered</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Medal className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                  <span>Prize: {featuredContest.prize}</span>
                </div>
              </div>
            </div>

            {/* Countdown Clock Panel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-amber-200/50 dark:border-gray-700/60 shadow-inner">
              <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {featuredContest.status === "running" ? "Ends In" : "Starts In"}
              </div>

              {/* Countdown Numbers */}
              <div className="flex gap-3 text-center mb-6">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hrs" },
                  { value: countdown.minutes, label: "Mins" },
                  { value: countdown.seconds, label: "Secs" },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="w-14 h-12 md:w-16 md:h-14 bg-amber-500 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Enter / Register Button */}
              {featuredContest.status === "running" ? (
                <Link
                  to={`/contest-room/${featuredContest.id}`}
                  className="w-full py-3 px-6 text-center font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Enter Contest Arena</span>
                  <ArrowRight className="w-5 h-5 animate-bounce" />
                </Link>
              ) : (
                <button
                  onClick={() => handleRegister(featuredContest.id)}
                  disabled={registeredContests.includes(featuredContest.id)}
                  className={`w-full py-3 px-6 font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white
                    ${registeredContests.includes(featuredContest.id)
                      ? "bg-green-500 cursor-default"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-600 dark:to-indigo-700 hover:opacity-90"
                    }`}
                >
                  {registeredContests.includes(featuredContest.id) ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Registered!</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-5 h-5" />
                      <span>Register For Contest</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 gap-4">
        {/* Custom Glassmorphic Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl w-full md:w-auto">
          {[
            { id: "active", label: "Active & Upcoming", icon: <Calendar className="w-4 h-4" /> },
            { id: "past", label: "Past Contests", icon: <Trophy className="w-4 h-4" /> },
            { id: "leaderboard", label: "Leaderboard", icon: <Medal className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold rounded-lg cursor-pointer transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-amber-500 dark:bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search filter for Active/Past tabs */}
        {activeTab !== "leaderboard" && (
          <div className="relative w-full md:w-80">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl shadow-inner focus-within:ring-2 focus-within:ring-amber-500 dark:focus-within:ring-indigo-500 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search contest by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-xs md:text-sm text-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredContests.length > 0 ? (
              filteredContests.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-amber-400 dark:hover:border-indigo-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Upper Line */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white hover:text-amber-500 dark:hover:text-indigo-400 transition-colors">
                        {c.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${c.status === "running"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                          : "bg-amber-50 text-amber-600 dark:bg-indigo-950/20 dark:text-indigo-400"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {c.description}
                    </p>

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-indigo-400" />
                        <span>Duration: {c.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Users className="w-3.5 h-3.5 text-amber-500 dark:text-indigo-400" />
                        <span>{c.registeredCount + (registeredContests.includes(c.id) ? 1 : 0)} Users</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500 dark:text-indigo-400" />
                        <span>Ques: {c.questionsCount} ({c.totalPoints} pts)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Award className="w-3.5 h-3.5 text-amber-500 dark:text-indigo-400" />
                        <span className="truncate">{c.prize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Action */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleRegister(c.id)}
                      disabled={registeredContests.includes(c.id) || c.status === "running"}
                      className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all border
                        ${registeredContests.includes(c.id)
                          ? "bg-green-500 text-white border-green-500 cursor-default"
                          : c.status === "running"
                            ? "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600 cursor-not-allowed"
                            : "bg-transparent text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-indigo-400 dark:border-gray-600 dark:hover:bg-gray-700"
                        }`}
                    >
                      {registeredContests.includes(c.id) 
                        ? "Registered" 
                        : c.status === "running" 
                          ? "In Progress" 
                          : "Register"}
                    </button>
                    <Link
                      to={c.status === "running" ? `/contest-room/${c.id}` : `/contest/details/${c.id}`}
                      className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold text-center transition-all border flex items-center justify-center gap-1
                        ${c.status === "running"
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-600 dark:to-indigo-700 text-white border-transparent"
                          : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        }`}
                    >
                      <span>{c.status === "running" ? "Enter Arena" : "View Details"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center p-8 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg">No active contests match your search</h3>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Try spelling out or searching another name.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "past" && (
          <motion.div
            key="past"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-850">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contest Name</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Conducted</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Performer</th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solutions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {PAST_CONTESTS.map((pc) => (
                      <tr key={pc.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900 dark:text-white hover:text-amber-500 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                            {pc.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pc.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{pc.questionsCount} Problems</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{pc.participants.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">★</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{pc.winner}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({pc.topScore})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <Link 
                            to={`/contest/editorial/${pc.id}`} 
                            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold"
                          >
                            <span>Problems</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-end">
              {/* Rank 2 */}
              <div className="order-2 sm:order-1 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-black text-xl text-gray-700 dark:text-gray-200 border-4 border-slate-200 dark:border-slate-800">
                    {LEADERBOARD_MOCK[1].avatar}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-400 dark:bg-slate-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">#2</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-full">{LEADERBOARD_MOCK[1].name}</h4>
                <div className="text-sm font-extrabold text-slate-600 dark:text-slate-400 mt-1">{LEADERBOARD_MOCK[1].rating} pts</div>
                <div className="text-xs text-green-500 font-semibold mt-1 flex items-center gap-0.5 justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{LEADERBOARD_MOCK[1].ratingChange}</span>
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="order-1 sm:order-2 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-gray-850 p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-500/30 shadow-md text-center flex flex-col items-center justify-center sm:-translate-y-4">
                <div className="relative mb-4">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl text-amber-500 animate-bounce">👑</div>
                  <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center font-black text-2xl text-white border-4 border-amber-300 dark:border-amber-700">
                    {LEADERBOARD_MOCK[0].avatar}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">#1</span>
                </div>
                <h4 className="font-black text-lg text-gray-900 dark:text-white truncate max-w-full">{LEADERBOARD_MOCK[0].name}</h4>
                <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">{LEADERBOARD_MOCK[0].rating} pts</div>
                <div className="text-xs text-green-500 font-semibold mt-1 flex items-center gap-0.5 justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{LEADERBOARD_MOCK[0].ratingChange}</span>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="order-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-amber-700/80 flex items-center justify-center font-black text-xl text-white border-4 border-amber-800 dark:border-gray-800">
                    {LEADERBOARD_MOCK[2].avatar}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-700 text-white font-black text-xs px-2.5 py-0.5 rounded-full">#3</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-full">{LEADERBOARD_MOCK[2].name}</h4>
                <div className="text-sm font-extrabold text-amber-800 dark:text-amber-500 mt-1">{LEADERBOARD_MOCK[2].rating} pts</div>
                <div className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-0.5 justify-center">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{LEADERBOARD_MOCK[2].ratingChange}</span>
                </div>
              </div>
            </div>

            {/* General Rankings Table */}
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3.5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coder Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Global Rating</th>
                    <th className="px-6 py-3.5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating Shift</th>
                    <th className="px-6 py-3.5 text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solved Problems</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {LEADERBOARD_MOCK.map((user) => (
                    <tr key={user.rank} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                        {user.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.color} text-white flex items-center justify-center font-bold text-xs mr-3 shadow-sm`}>
                            {user.avatar}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-extrabold">{user.rating.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.ratingChange > 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-0.5">
                            <TrendingUp className="w-4.5 h-4.5" />
                            <span>+{user.ratingChange}</span>
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-0.5">
                            <TrendingDown className="w-4.5 h-4.5" />
                            <span>{user.ratingChange}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.solved} Solves</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
