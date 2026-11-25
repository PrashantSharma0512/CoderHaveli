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
  Copy,
  Code2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from '@/components/helper/axiosInstance';

interface ContestDetailClientProps {
  contestId: string;
  initialContest?: any;
}

export default function ContestDetailClient({
  contestId,
  initialContest = null,
}: ContestDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.login || {});

  const [contest, setContest] = useState<any>(initialContest);
  const [loading, setLoading] = useState<boolean>(!initialContest);
  const [error, setError] = useState<string | null>(null);
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
    } catch (err: any) {
      if (!contest) {
        setError(err.response?.data?.message || 'Failed to load contest details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contest) {
      fetchContestDetail();
    }
  }, [contestId]);

  const handleRegister = async (shouldRedirect = false) => {
    if (!isAuthenticated) {
      toast.error('Please login to register for this contest');
      router.push('/login');
      return;
    }

    if (contest?.contestType === 'private' && !contest?.isUserRegistered) {
      setAccessCodeModal({ open: true, shouldRedirect });
      return;
    }

    executeRegistration(null, shouldRedirect);
  };

  const executeRegistration = async (code: string | null = null, shouldRedirect = false) => {
    try {
      setRegistering(true);
      const payload = code ? { accessCode: code } : {};
      const res = await axiosInstance.post(`/api/contests/${contestId}/register`, payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Successfully registered!');
        setAccessCodeModal({ open: false, shouldRedirect: false });
        setAccessCode('');
        await fetchContestDetail();
        if (shouldRedirect) {
          router.push(`/contests/${contestId}/arena`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !contest) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !contest) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Contest</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href="/contests"
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
        >
          Back to Contests
        </Link>
      </div>
    );
  }

  const isLive = contest?.status === 'live';
  const isEnded = contest?.status === 'ended';
  const isRegistered = Boolean(contest?.isUserRegistered);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Contests</span>
          </Link>
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold hover:border-amber-500 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-none space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isLive
                  ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
                  : isEnded
                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
              }`}
            >
              {contest?.status?.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {contest?.difficulty || 'All Levels'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
              {contest?.contestType === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {contest?.contestType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {contest?.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
            {contest?.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-gray-400 block text-xs">Starts At</span>
              <span className="font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {new Date(contest?.startTime).toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-xs">Duration</span>
              <span className="font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {contest?.durationMinutes || 120} Mins
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-xs">Registered</span>
              <span className="font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                {contest?.registeredCount || 0} Coders
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-xs">Prize</span>
              <span className="font-bold flex items-center gap-1 truncate">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {contest?.prize || 'CoderHaveli Badges'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            {isLive ? (
              isRegistered ? (
                <Link
                  href={`/contests/${contestId}/arena`}
                  className="px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 animate-bounce" />
                  <span>Enter Live Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => handleRegister(true)}
                  disabled={registering}
                  className="px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{registering ? 'Registering...' : 'Register & Enter Arena'}</span>
                </button>
              )
            ) : isEnded ? (
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contest-problems"
                  className="px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <Code2 className="w-5 h-5" />
                  <span>Solve Contest Problems</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href={`/contests/${contestId}/leaderboard`}
                  className="px-6 py-4 rounded-2xl font-bold text-white bg-gray-900 dark:bg-gray-800 hover:bg-black transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>View Leaderboard</span>
                </Link>
              </div>
            ) : isRegistered ? (
              <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>You are registered for this contest!</span>
              </div>
            ) : (
              <button
                onClick={() => handleRegister(false)}
                disabled={registering}
                className="px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{registering ? 'Registering...' : 'Register for Contest'}</span>
              </button>
            )}

            {!isEnded && (
              <Link
                href={`/contests/${contestId}/leaderboard`}
                className="px-6 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              >
                Leaderboard
              </Link>
            )}
          </div>
        </div>

        {/* Contest Problems Section */}
        <div id="contest-problems" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Code2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Contest Problems
                </h2>
                {isEnded && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Upsolve & Practice Open
                  </span>
                )}
                {isLive && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse">
                    Live Arena
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {isEnded
                  ? 'The contest has ended. All problems are available to solve and practice with full compiler support, custom test cases, and solutions.'
                  : isLive
                  ? 'Contest is live! Compete and solve problems in the arena.'
                  : 'Problems will unlock as soon as the contest starts.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                {contest?.problems?.length || 0} Challenges
              </span>
            </div>
          </div>

          {/* Problems List */}
          {contest?.problems && contest.problems.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {contest.problems.map((prob: any, idx: number) => {
                const targetId = prob.problemId || prob._id || prob.quesId;
                const isLocked = Boolean(prob.locked);
                const difficultyColor =
                  prob.difficulty?.toLowerCase() === 'easy'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : prob.difficulty?.toLowerCase() === 'medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';

                return (
                  <div
                    key={prob.problemId || prob._id || idx}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/60 dark:hover:bg-gray-800/40 px-3 -mx-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-700 dark:text-gray-300 shrink-0">
                        {prob.order || idx + 1}
                      </span>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {isLocked ? (
                            <span className="font-bold text-sm sm:text-base text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <span>{prob.title || `Problem ${idx + 1}`}</span>
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                          ) : targetId ? (
                            <Link
                              href={`/problem/${targetId}`}
                              className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5"
                            >
                              <span>{prob.title || `Problem ${idx + 1}`}</span>
                            </Link>
                          ) : (
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                              {prob.title || `Problem ${idx + 1}`}
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${difficultyColor}`}>
                            {prob.difficulty || 'Easy'}
                          </span>

                          {prob.points && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {prob.points} Pts
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {Array.isArray(prob.tags) && prob.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {prob.tags.map((tag: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Problem Actions */}
                    <div className="flex items-center gap-2 sm:shrink-0 self-end sm:self-center">
                      {isLocked ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      ) : isEnded && targetId ? (
                        <Link
                          href={`/problem/${targetId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
                        >
                          <span>Solve Problem</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : isLive ? (
                        isRegistered ? (
                          <Link
                            href={`/contests/${contestId}/arena`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 text-white shadow-sm transition-all"
                          >
                            <span>Arena</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleRegister(true)}
                            disabled={registering}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
                          >
                            <span>Register & Solve</span>
                          </button>
                        )
                      ) : targetId ? (
                        <Link
                          href={`/problem/${targetId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 space-y-2">
              <HelpCircle className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {isEnded
                  ? 'No problems were recorded for this contest.'
                  : 'Problems will appear here once published by the organizer.'}
              </p>
            </div>
          )}
        </div>

        {/* Contest Rules & Guidelines */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Contest Rules & Guidelines</span>
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
            <li>Submissions are evaluated against multiple public and hidden test cases.</li>
            <li>Penalty time is calculated based on elapsed time from the start plus incorrect submission penalties.</li>
            <li>Plagiarism or sharing solutions will result in immediate disqualification and leaderboard expulsion.</li>
            <li>Supported languages include C++, Java, Python, and JavaScript.</li>
          </ul>
        </div>

        {/* Private Contest Modal */}
        {accessCodeModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold">Enter Private Access Code</h3>
              <p className="text-xs text-gray-500">
                This contest is private. Please enter the invitation code to proceed.
              </p>
              <input
                type="text"
                placeholder="Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono outline-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setAccessCodeModal({ open: false, shouldRedirect: false })}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  disabled={!accessCode.trim() || registering}
                  onClick={() => executeRegistration(accessCode.trim(), accessCodeModal.shouldRedirect)}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl"
                >
                  {registering ? 'Verifying...' : 'Submit Code'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
