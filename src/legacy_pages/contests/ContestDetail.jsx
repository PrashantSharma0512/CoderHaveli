'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  HelpCircle,
  Lock,
  Globe,
  Flame,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Share2,
  FileText,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axiosInstance from '../../components/helper/axiosInstance';

function ContestDetail() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.login || {});

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [accessCodeModal, setAccessCodeModal] = useState({ open: false, shouldRedirect: false });
  const [accessCode, setAccessCode] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchContestDetail = async () => {
    if (!contestId) {
      setError('Contest ID is missing');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/contests/${contestId.trim()}`);
      if (res.data?.success) {
        setContest(res.data.contest);
      } else {
        setError(res.data?.message || 'Contest not found');
      }
    } catch (err) {
      console.error('Error fetching contest details:', err);
      setError(err.response?.data?.message || 'Failed to load contest details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestDetail();
  }, [contestId]);

  // Robust Countdown timer
  const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
    useEffect(() => {
      if (!targetDate) return;
      const calc = () => {
        const target = new Date(targetDate).getTime();
        if (isNaN(target)) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        const diff = target - Date.now();
        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          expired: false
        });
      };
      calc();
      const t = setInterval(calc, 1000);
      return () => clearInterval(t);
    }, [targetDate]);
    return timeLeft;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/contests/${contestId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: contest?.title || 'CoderHaveli Contest',
          text: `Check out "${contest?.title || 'Contest'}" on CoderHaveli!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Contest link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch (err) {
        console.warn('Clipboard writeText failed, trying fallback:', err);
      }
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        toast.success('Contest link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      } else {
        toast.error('Could not copy link automatically');
      }
    } catch (err) {
      toast.error('Could not copy link automatically');
    }
  };

  const targetTime = contest?.status === 'live' ? contest?.endTime : contest?.startTime;
  const countdown = useCountdown(targetTime);

  const handleRegister = async (shouldRedirectToArena = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in first to register and attempt this contest');
      navigate('/login', { state: { from: `/contests/${contestId}` } });
      return;
    }

    if (contest.contestType === 'private') {
      setAccessCodeModal({ open: true, shouldRedirect: shouldRedirectToArena });
      return;
    }

    sendRegistration(null, shouldRedirectToArena);
  };

  const sendRegistration = async (code = null, shouldRedirect = false) => {
    try {
      setRegistering(true);
      const payload = code ? { accessCode: code } : {};
      const res = await axiosInstance.post(`/api/contests/${contestId}/register`, payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Registered successfully!');
        setAccessCodeModal(false);
        await fetchContestDetail();
        if (shouldRedirect || contest?.status === 'live') {
          navigate(`/contests/${contestId}/arena`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister from this contest?')) return;
    try {
      setRegistering(true);
      const res = await axiosInstance.delete(`/api/contests/${contestId}/register`);
      if (res.data.success) {
        toast.success('Successfully unregistered');
        fetchContestDetail();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unregister');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || 'Contest Not Found'}</h2>
          <Link
            to="/contests"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contests</span>
          </Link>
        </div>
      </div>
    );
  }

  if (contest?.isPrivateRestricted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            to="/contests"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Contests</span>
          </Link>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Private Contest • Invite-Only
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {contest.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hosted by: <strong className="text-gray-700 dark:text-gray-200">{contest.host?.name || contest.host?.username || 'Contest Host'}</strong>
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              🔒 <strong>Access Restricted:</strong> This coding contest is private. Problem statements, test cases, and submissions are accessible exclusively to participants explicitly invited by the contest host.
            </div>

            <div className="grid grid-cols-3 gap-3 py-2 text-center text-xs border-y border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-gray-400 block font-medium">Status</span>
                <span className="font-bold uppercase text-amber-500">{contest.status}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Participants</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{contest.registeredCount || 0}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Duration</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{contest.duration || 60} mins</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/contests"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Browse Public Contests
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  state={{ from: `/contests/${contestId}` }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
                >
                  Log In With Invited Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/contests"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Contests</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm cursor-pointer"
            title="Share contest link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Hero Contest Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  contest.status === 'live'
                    ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
                    : contest.status === 'scheduled'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {contest.status === 'live' ? '● Live Contest' : contest.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {contest.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                  {contest.contestType === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  {contest.contestType}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white leading-tight">
                {contest.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {contest.description}
              </p>

              {/* Time & Scheduling Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Starts</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    {new Date(contest.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Timezone: {contest.timezone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Ends</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    {new Date(contest.endTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Duration: {contest.durationMinutes} Minutes</span>
                </div>
              </div>
            </div>

            {/* Action / Countdown Sidebar Box */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md text-center space-y-5">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                {contest.status === 'live' ? 'Contest Ends In' : 'Starts In'}
              </span>

              {/* Countdown Numbers */}
              <div className="flex justify-center gap-2">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hrs' },
                  { value: countdown.minutes, label: 'Mins' },
                  { value: countdown.seconds, label: 'Secs' },
                ].map((u, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-11 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow">
                      {String(u.value).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">{u.label}</span>
                  </div>
                ))}
              </div>

              {/* Primary Action Button */}
              {contest.status === 'live' ? (
                contest.isUserRegistered ? (
                  <Link
                    to={`/contests/${contest._id}/arena`}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Flame className="w-5 h-5 animate-bounce" />
                    <span>Enter Contest Arena</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleRegister(true)}
                    disabled={registering}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>{registering ? 'Registering...' : 'Register to Attempt Contest'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : contest.status === 'ended' ? (
                <Link
                  to={`/contests/${contest._id}/leaderboard`}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>View Leaderboard</span>
                </Link>
              ) : contest.isUserRegistered ? (
                <div className="space-y-2">
                  <div className="py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Registered For Contest</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Contest Arena unlocks when contest goes live.
                  </p>
                  <button
                    onClick={handleUnregister}
                    disabled={registering}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Unregister before start
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(false)}
                  disabled={registering}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600 hover:opacity-95 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  {registering ? 'Registering...' : 'Register For Contest'}
                </button>
              )}

              {/* Stats Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-around">
                <div>
                  <span className="block font-bold text-gray-800 dark:text-gray-200">{contest.registeredCount}</span>
                  <span>Registered</span>
                </div>
                <div>
                  <span className="block font-bold text-gray-800 dark:text-gray-200">{contest.problems?.length || 0}</span>
                  <span>Problems</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info (Overview & Problems) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Problems Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <span>Contest Problems</span>
                </h3>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {contest.problems?.length || 0} Challenges
                </span>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {contest.problems?.map((p, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-600 dark:text-gray-300">
                        {p.order || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{p.title}</span>
                          {p.locked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                        </div>
                        <span className="text-xs text-gray-400">{p.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        {p.points} Pts
                      </span>
                      {contest.status === 'live' && (
                        contest.isUserRegistered ? (
                          <Link
                            to={`/contests/${contest._id}/arena`}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold"
                          >
                            Solve
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleRegister(true)}
                            disabled={registering}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Register to Solve
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Rules & Instructions */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Rules & Instructions</span>
              </h3>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                {contest.rules || 'Standard contest rules apply. Maintain code integrity and fair play.'}
              </div>
            </div>
          </div>

          {/* Sidebar Scoring & Organizer info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scoring Policy Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Scoring & Penalties</span>
              </h3>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span>Wrong Attempt Penalty</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    +{contest.scoringConfig?.wrongPenalty || 10} Mins
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span>Tie-Breaker Rule</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    Penalty Time then Solve Time
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span>Leaderboard Policy</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                    {contest.leaderboardVisibility}
                  </span>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Contest Host
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={contest.createdBy?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={contest.createdBy?.name || 'Organizer'}
                  className="w-10 h-10 rounded-full object-cover border border-amber-300 dark:border-amber-500/50"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {contest.createdBy?.name || 'CoderHaveli Team'}
                  </h4>
                  <p className="text-xs text-gray-400">@{contest.createdBy?.username || 'coderhaveli'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Private Access Code Modal */}
        {Boolean(accessCodeModal?.open || accessCodeModal === true) && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-lg">Enter Access Code</h3>
              <p className="text-xs text-gray-500">This is a private contest. Enter the code provided by the organizer.</p>
              <input
                type="text"
                placeholder="Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setAccessCodeModal({ open: false, shouldRedirect: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendRegistration(accessCode.trim(), Boolean(accessCodeModal?.shouldRedirect))}
                  disabled={!accessCode.trim() || registering}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600"
                >
                  {registering ? 'Verifying...' : 'Submit & Enter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

class ContestErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ContestErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unable to display contest</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              An error occurred while loading this contest view. Please try reloading or head back to all contests.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <Link
                to="/contests"
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                All Contests
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ContestDetailWrapper(props) {
  return (
    <ContestErrorBoundary>
      <ContestDetail {...props} />
    </ContestErrorBoundary>
  );
}
