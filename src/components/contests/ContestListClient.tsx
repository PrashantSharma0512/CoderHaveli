'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Search,
  ArrowRight,
  Flame,
  CheckCircle,
  HelpCircle,
  Award,
  Filter,
  Lock,
  Globe,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axiosInstance from '@/components/helper/axiosInstance';

interface ContestListClientProps {
  initialContests?: any[];
  initialTotalPages?: number;
}

export default function ContestListClient({
  initialContests = [],
  initialTotalPages = 1,
}: ContestListClientProps) {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector((state: any) => state.login || {});

  const [contests, setContests] = useState<any[]>(initialContests);
  const [loading, setLoading] = useState<boolean>(initialContests.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, live, scheduled, ended
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startTime');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Registration modal for private contest
  const [selectedContestForReg, setSelectedContestForReg] = useState<any>(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [registering, setRegistering] = useState(false);

  // Fetch contests from backend on filter change
  const fetchContests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter === 'all' ? '' : statusFilter,
        difficulty: difficultyFilter === 'all' ? '' : difficultyFilter,
        contestType: typeFilter === 'all' ? '' : typeFilter,
        sortBy,
        page: String(page),
        limit: '12',
      });

      const response = await axiosInstance.get(`/api/contests?${params.toString()}`);
      if (response.data.success) {
        setContests(response.data.contests);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (err: any) {
      if (contests.length === 0) {
        setError('Unable to load contests. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only refetch on client after initial mount or when filters change
    fetchContests();
  }, [searchQuery, statusFilter, difficultyFilter, typeFilter, sortBy, page]);

  // Featured live or next upcoming contest
  const featuredContest =
    contests.find((c) => c.status === 'live') ||
    contests.find((c) => c.status === 'scheduled') ||
    contests[0];

  // Countdown timer hook
  const useCountdown = (targetDate: any) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: false,
    });

    useEffect(() => {
      if (!targetDate) return;
      const calculateTimeLeft = () => {
        const diff = +new Date(targetDate) - +new Date();
        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          expired: false,
        });
      };
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
  };

  const featuredTargetDate =
    featuredContest?.status === 'live' ? featuredContest?.endTime : featuredContest?.startTime;
  const countdown = useCountdown(featuredTargetDate);

  // Handle register
  const handleRegisterClick = (contest: any, shouldRedirectToArena = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for contests');
      router.push('/login');
      return;
    }

    if (contest.contestType === 'private') {
      setSelectedContestForReg({ ...contest, shouldRedirectToArena });
      setAccessCodeInput('');
      return;
    }

    executeRegister(contest._id, null, shouldRedirectToArena || contest.status === 'live');
  };

  const executeRegister = async (contestId: string, accessCode: string | null = null, shouldRedirect = false) => {
    try {
      setRegistering(true);
      const payload = accessCode ? { accessCode } : {};
      const response = await axiosInstance.post(`/api/contests/${contestId}/register`, payload);
      if (response.data.success) {
        toast.success(response.data.message || 'Registered successfully!');
        setSelectedContestForReg(null);
        await fetchContests();
        if (shouldRedirect) {
          router.push(`/contests/${contestId}/arena`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register for contest');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Live Now
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Upcoming
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            Ended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-200 dark:border-rose-900">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  Coding Contests
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Compete in live algorithmic battles, climb rankings, and win CoderHaveli recognitions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/contests/pass"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 border border-amber-500/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Contest Pass</span>
            </Link>

            <Link
              href="/contests/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Host Contest</span>
            </Link>

            {role === 'admin' && (
              <Link
                href="/admin/contests"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <span>Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={fetchContests}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs transition-all cursor-pointer"
              title="Refresh contests"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Featured Hero Contest Banner */}
        {featuredContest && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-orange-50/60 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-950 border border-amber-200/70 dark:border-gray-800 shadow-xl dark:shadow-none p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(featuredContest.status)}
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {featuredContest.difficulty || 'All Levels'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                    {featuredContest.contestType === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {featuredContest.contestType}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {featuredContest.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {featuredContest.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Duration: {featuredContest.durationMinutes || 120} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>{featuredContest.registeredCount || 0} Registered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>{featuredContest.problemsCount || 0} Problems</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="truncate max-w-[200px]">{featuredContest.prize || 'CoderHaveli Badges'}</span>
                  </div>
                </div>
              </div>

              {/* Countdown & Action Column */}
              <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs dark:shadow-none flex flex-col items-center text-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  {featuredContest.status === 'live' ? 'Contest Ends In' : 'Starts In'}
                </span>

                {/* Clock digits */}
                <div className="flex gap-2.5 sm:gap-3 mb-6">
                  {[
                    { value: countdown.days, label: 'Days' },
                    { value: countdown.hours, label: 'Hrs' },
                    { value: countdown.minutes, label: 'Mins' },
                    { value: countdown.seconds, label: 'Secs' },
                  ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-13 sm:w-16 h-12 sm:h-14 bg-gradient-to-b from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Main Action Button */}
                {featuredContest.status === 'live' ? (
                  featuredContest.isUserRegistered ? (
                    <Link
                      href={`/contests/${featuredContest._id}/arena`}
                      className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Flame className="w-5 h-5 animate-bounce" />
                      <span>Enter Contest Arena</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(featuredContest, true)}
                      disabled={registering}
                      className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <span>{registering ? 'Registering...' : 'Register to Attempt Contest'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                ) : featuredContest.status === 'ended' ? (
                  <Link
                    href={`/contests/${featuredContest._id}/leaderboard`}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>View Results & Leaderboard</span>
                  </Link>
                ) : featuredContest.isUserRegistered ? (
                  <Link
                    href={`/contests/${featuredContest._id}`}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Registered • View Details</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleRegisterClick(featuredContest, false)}
                    disabled={registering}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{registering ? 'Registering...' : 'Register For Contest'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-xs dark:shadow-none space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contests by title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              />
            </div>

            {/* Quick Status Pill Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {[
                { id: 'all', label: 'All Contests' },
                { id: 'live', label: 'Live' },
                { id: 'scheduled', label: 'Upcoming' },
                { id: 'ended', label: 'Ended' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>

            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPage(1);
              }}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="practice">Practice</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none font-medium"
              >
                <option value="startTime">Start Date</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4 animate-pulse shadow-xs dark:shadow-none"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-14 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-rose-700 dark:text-rose-400 font-bold">{error}</p>
            <button
              onClick={fetchContests}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Contests Grid */}
        {!loading && !error && contests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500/80 rounded-2xl p-5 shadow-xs dark:shadow-none transition-colors duration-150 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getStatusBadge(c.status)}
                      {c.weeklyIdentifier ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          🏆 Weekly
                        </span>
                      ) : c.contestType === 'private' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Private
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" /> Public
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {c.difficulty || 'All Levels'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white line-clamp-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      {c.title}
                    </h3>
                    {c.host && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Host:{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {c.host.name || c.host.username || 'CoderHaveli'}
                        </span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {c.isPrivateRestricted
                      ? 'Private Contest • Only authorized participants invited by the host can access problem statements and submit.'
                      : c.description || 'Join this competitive programming contest on CoderHaveli.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{c.durationMinutes || 120} Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{c.registeredCount || 0} Registered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{c.problemsCount || 0} Problems</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{new Date(c.startTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <Link
                    href={`/contests/${c._id}`}
                    className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    Details
                  </Link>

                  {c.status === 'live' ? (
                    c.isUserRegistered ? (
                      <Link
                        href={`/contests/${c._id}/arena`}
                        className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 shadow-xs transition-all flex items-center justify-center gap-1"
                      >
                        <span>Arena</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(c, true)}
                        disabled={registering}
                        className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span>Register</span>
                      </button>
                    )
                  ) : c.status === 'ended' ? (
                    <Link
                      href={`/contests/${c._id}/leaderboard`}
                      className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Results</span>
                    </Link>
                  ) : c.isUserRegistered ? (
                    <span className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(c, false)}
                      disabled={registering}
                      className="flex-1 py-2.5 px-3 text-center rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 transition-all cursor-pointer"
                    >
                      Register
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && contests.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 rounded-3xl space-y-4">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-200">No contests found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any contests matching your current search or filter criteria. Try clearing some filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDifficultyFilter('all');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Private Contest Access Code Modal */}
        {selectedContestForReg && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl dark:shadow-none space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                    Private Contest Registration
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedContestForReg.title}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300">
                This is an exclusive or invitation-only contest. Please enter the authorized access code provided by the organizer.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Access Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. HAVELI_CODE_2026"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setSelectedContestForReg(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!accessCodeInput.trim() || registering}
                  onClick={() =>
                    executeRegister(
                      selectedContestForReg._id,
                      accessCodeInput.trim(),
                      Boolean(selectedContestForReg.shouldRedirectToArena)
                    )
                  }
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-50 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {registering ? 'Verifying...' : 'Verify & Enter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
