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
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
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
              <Link
                href={`/contests/${contestId}/leaderboard`}
                className="px-8 py-4 rounded-2xl font-black text-white bg-gray-900 dark:bg-gray-800 hover:bg-black transition-all flex items-center gap-2"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>View Final Leaderboard</span>
              </Link>
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

            <Link
              href={`/contests/${contestId}/leaderboard`}
              className="px-6 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
            >
              Leaderboard
            </Link>
          </div>
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
