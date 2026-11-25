'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  Tag,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Lock,
  X,
  History
} from 'lucide-react';
import HaveliCoinIcon from '@/components/common/HaveliCoinIcon';
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from '@/components/helper/axiosInstance';
import CodeTapasyaCalendar from './CodeTapasyaCalendar';

interface PersonalAajKaSawalInfo {
  isActive: boolean;
  selectedTopic: string | null;
  purchasedAt?: string | null;
  expiresAt?: string | null;
}

interface AajKaSawalData {
  _id?: string;
  quesId: string;
  problemId?: string;
  problemObjectId?: string;
  problemRef?: any;
  quesName: string;
  difficulty: string;
  tags?: string[];
  descriptionSnippet?: string;
  catchyQuote?: string;
  totalSolves?: number;
  secondsUntilNext?: number;
  userStreak?: number;
  isSolvedToday?: boolean;
  isPersonal?: boolean;
  personalTopic?: string | null;
  haveliCoins?: number;
  coinReward?: number;
  personalPotdPrice?: number;
  personalPotdDurationDays?: number;
  personalAajKaSawal?: PersonalAajKaSawalInfo;
}

interface TopicItem {
  topic: string;
  count: number;
}

interface CoinTx {
  _id: string;
  amount: number;
  type: string;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

interface AajKaSawalCardProps {
  userId?: string;
  className?: string;
  showCalendarToggle?: boolean;
  initiallyOpenCalendar?: boolean;
}

export default function AajKaSawalCard({
  userId,
  className = '',
  showCalendarToggle = false,
  initiallyOpenCalendar = false
}: AajKaSawalCardProps) {
  const [data, setData] = useState<AajKaSawalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [showCalendar, setShowCalendar] = useState<boolean>(initiallyOpenCalendar);

  // Personal AajKaSawal & Haveli Coins modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [transactions, setTransactions] = useState<CoinTx[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchToday = useCallback(async () => {
    try {
      const url = `/api/daily/aaj-ka-sawal${userId ? `?userId=${userId}` : ''}`;
      const res = await axiosInstance.get(url);
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setSecondsLeft(res.data.data.secondsUntilNext || 0);
        if (res.data.data.personalAajKaSawal?.selectedTopic) {
          setSelectedTopic(res.data.data.personalAajKaSawal.selectedTopic);
        }
      }
    } catch (err: any) {
      console.warn('AajKaSawal fallback active:', err?.message || err);
      setData({
        quesId: '11',
        quesName: 'Container With Most Water',
        difficulty: 'Medium',
        tags: ['Array', 'Two Pointers', 'Greedy'],
        descriptionSnippet: 'Find two lines that together with the x-axis form a container that contains the most water.',
        catchyQuote: "Consistency is the Key — Solve Today's Challenge!",
        totalSolves: 128,
        secondsUntilNext: 28800,
        userStreak: 0,
        isSolvedToday: false,
        coinReward: 1,
        personalPotdPrice: 50,
        personalPotdDurationDays: 30
      });
      setSecondsLeft(28800);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  // Live countdown timer ticking every second
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const openPersonalModal = async () => {
    setModalOpen(true);
    setShowHistory(false);
    try {
      const [topicsRes, coinsRes] = await Promise.all([
        axiosInstance.get('/api/daily/topics'),
        userId ? axiosInstance.get('/api/daily/coins').catch(() => null) : Promise.resolve(null)
      ]);
      if (topicsRes.data?.success && Array.isArray(topicsRes.data.data)) {
        setTopics(topicsRes.data.data);
      }
      if (coinsRes?.data?.success && coinsRes.data.data) {
        setTransactions(coinsRes.data.data.transactions || []);
        setData((prev) =>
          prev
            ? {
                ...prev,
                haveliCoins: coinsRes.data.data.haveliCoins,
                personalAajKaSawal: coinsRes.data.data.personalAajKaSawal
              }
            : prev
        );
      }
    } catch (err) {
      console.error('Error loading Personal AajKaSawal details:', err);
    }
  };

  const handlePurchasePersonalPlan = async () => {
    if (!userId) {
      toast.error('Please log in to unlock Personal AajKaSawal');
      return;
    }
    try {
      setSubmittingAction(true);
      const res = await axiosInstance.post('/api/daily/personal-potd/purchase', {
        topic: selectedTopic || null
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Personal AajKaSawal unlocked!');
        if (res.data?.data?.haveliCoins !== undefined) {
          window.dispatchEvent(new CustomEvent('haveli-coins-updated', { detail: { balance: res.data.data.haveliCoins } }));
        }
        await fetchToday();
        setModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not purchase Personal AajKaSawal');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleUpdateTopic = async (newTopic: string | null) => {
    if (!userId) {
      toast.error('Please log in first');
      return;
    }
    try {
      setSubmittingAction(true);
      const res = await axiosInstance.patch('/api/daily/personal-potd/topic', {
        topic: newTopic
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Topic updated!');
        setSelectedTopic(newTopic || '');
        await fetchToday();
        setModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update topic');
    } finally {
      setSubmittingAction(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
  };

  const getDifficultyColor = (diff: string) => {
    switch ((diff || '').toLowerCase()) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
      case 'hard':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800';
      case 'medium':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800';
    }
  };

  const getCleanQuote = (quote?: string) => {
    if (
      !quote ||
      quote.includes('Haveli') ||
      quote.includes('Sawal') ||
      quote.includes('Niyam') ||
      quote.includes('Sikandar') ||
      quote.includes('Sangram') ||
      quote.includes('Karein') ||
      quote.includes('Bole') ||
      quote.includes('Chhoti') ||
      quote.includes('Kadam')
    ) {
      if (data?.isPersonal && data?.personalTopic) {
        return `Personal AajKaSawal (${data.personalTopic}) — Master Your Chosen Topic!`;
      }
      return "Consistency is the Key — Solve Today's Challenge!";
    }
    return quote;
  };

  if (loading) {
    return (
      <div className={`p-5 rounded-2xl bg-amber-50/50 dark:bg-gray-900 border border-amber-200 dark:border-amber-900/40 animate-pulse ${className}`}>
        <div className="h-5 w-44 bg-amber-200/60 dark:bg-gray-800 rounded-full mb-3" />
        <div className="h-7 w-64 bg-amber-200/60 dark:bg-gray-800 rounded-lg mb-2" />
        <div className="h-3.5 w-full max-w-md bg-amber-100 dark:bg-gray-800 rounded mb-4" />
        <div className="h-9 w-36 bg-amber-300/60 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const targetId =
    data.problemId ||
    data.problemObjectId ||
    (typeof data.problemRef === 'object' ? data.problemRef?._id : data.problemRef) ||
    data._id ||
    data.quesId;

  const problemHref = `/problem/${targetId}`;
  const isPersonalActive = !!data.personalAajKaSawal?.isActive;
  const filteredTopics = topics.filter((t) =>
    t.topic.toLowerCase().includes(topicFilter.trim().toLowerCase())
  );

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          data.isPersonal
            ? 'border-purple-300/80 dark:border-purple-800/60 bg-gradient-to-br from-purple-500/10 via-amber-500/5 to-indigo-600/10 dark:from-purple-950/30 dark:via-gray-900 dark:to-indigo-950/20 shadow-lg shadow-purple-500/10'
            : 'border-amber-300/80 dark:border-amber-800/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10 dark:from-amber-950/30 dark:via-gray-900 dark:to-orange-950/20 shadow-lg shadow-amber-500/10'
        } backdrop-blur-md transition-all ${className}`}
      >
        {/* Decorative ambient aura */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Main Content Area */}
        <div className="relative p-4 sm:p-5 z-10 flex flex-col justify-between">
          <div>
            {/* Top Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {data.isPersonal ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    Personal AajKaSawal • {data.personalTopic}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    Problem of the Day
                  </span>
                )}

                {/* Streak Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 animate-bounce" />
                  {data.userStreak || 0} Day Streak
                </span>

                {/* Haveli Coins Badge */}
                {userId && (
                  <button
                    type="button"
                    onClick={openPersonalModal}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 hover:scale-105 transition-transform cursor-pointer"
                    title="View Haveli Coins & Personal AajKaSawal"
                  >
                    <HaveliCoinIcon size={16} />
                    <span>{data.haveliCoins ?? 0} Haveli Coins</span>
                  </button>
                )}

                {data.isSolvedToday && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Solved Today
                  </span>
                )}
              </div>

              {/* Countdown Timer to Next Challenge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-amber-200 dark:border-amber-900/60 shadow-xs self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin-slow" />
                <div className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                  <span className="text-[10px] uppercase text-gray-400 mr-1 hidden sm:inline">
                    Next Challenge:
                  </span>
                  <span className="text-amber-600 dark:text-amber-400" suppressHydrationWarning>
                    {formatTime(secondsLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Motivational Tagline */}
            <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>✨</span>
                <span>{getCleanQuote(data.catchyQuote)}</span>
              </p>
              {!data.isSolvedToday && (data.coinReward ?? 1) > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
                  <HaveliCoinIcon size={14} />
                  Reward: +{data.coinReward ?? 1} Haveli {(data.coinReward ?? 1) === 1 ? 'Coin' : 'Coins'}
                </span>
              )}
            </div>

            {/* Problem Title & Meta Info */}
            <div className="mb-3">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <Link
                  href={problemHref}
                  className="group text-xl sm:text-2xl font-black text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{data.quesName}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </Link>

                {/* Difficulty Badge */}
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getDifficultyColor(
                    data.difficulty
                  )}`}
                >
                  {data.difficulty}
                </span>
              </div>

              {/* Snippet */}
              {data.descriptionSnippet && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 max-w-2xl mb-2.5">
                  {data.descriptionSnippet}
                </p>
              )}

              {/* Tags & Solves count */}
              <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                {data.tags && data.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-gray-400" />
                    {data.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white/70 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {data.tags.length > 3 && (
                      <span className="text-[11px] text-gray-400">+{data.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-[11px] font-medium">
                  <Users className="w-3 h-3 text-amber-500" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">{data.totalSolves ?? 0}</strong> Developers Solved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={problemHref}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  data.isSolvedToday
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/30 hover:scale-[1.01]'
                }`}
              >
                {data.isSolvedToday ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Solved Today (Solve Again)</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                    <span>Solve Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Link>

              {/* Personal AajKaSawal Topic / Purchase Button */}
              <button
                type="button"
                onClick={openPersonalModal}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border ${
                  isPersonalActive
                    ? 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-white/80 dark:bg-gray-800/80 hover:bg-amber-100/50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-amber-200 dark:border-amber-900/60'
                }`}
              >
                {isPersonalActive ? (
                  <>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>
                      {data.personalAajKaSawal?.selectedTopic
                        ? `Topic: ${data.personalAajKaSawal.selectedTopic}`
                        : 'Select Topic'}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Personal AajKaSawal ({data.personalPotdPrice ?? 50} Coins)</span>
                  </>
                )}
              </button>

              {showCalendarToggle && (
                <button
                  onClick={() => setShowCalendar((prev) => !prev)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/80 dark:bg-gray-800/80 hover:bg-amber-100/50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Calendar</span>
                  {showCalendar ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>
              )}
            </div>

            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 hidden sm:inline">
              #DailyCoding • Solve &amp; Earn Haveli Coins
            </span>
          </div>
        </div>

        {/* Expandable Calendar */}
        {showCalendarToggle && showCalendar && (
          <div className="p-4 bg-white/40 dark:bg-black/20 border-t border-amber-200/80 dark:border-amber-900/60 animate-fadeIn">
            <CodeTapasyaCalendar userId={userId} />
          </div>
        )}
      </div>

      {/* Personal AajKaSawal & Haveli Coins Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Personal AajKaSawal
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Choose your own topic (e.g. Binary Search, DP, Graph) for daily POTD challenges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mb-4">
              <div className="flex items-center gap-2.5">
                <HaveliCoinIcon size={28} />
                <div>
                  <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    Your Haveli Coins
                  </div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">
                    {data.haveliCoins ?? 0} Coins
                  </div>
                </div>
              </div>
              {userId && (
                <button
                  type="button"
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  {showHistory ? 'Hide History' : 'Coin History'}
                </button>
              )}
            </div>

            {showHistory ? (
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {transactions.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 py-6">
                    No coin transactions yet. Solve AajKaSawal daily to earn +{data.coinReward ?? 10} Haveli Coins!
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{tx.reason}</div>
                        <div className="text-[11px] text-gray-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`font-black ${
                          tx.amount >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                {isPersonalActive && (
                  <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 flex items-center justify-between">
                    <span>
                      <strong>Plan Active</strong>
                      {data.personalAajKaSawal?.expiresAt &&
                        ` • Valid until ${new Date(data.personalAajKaSawal.expiresAt).toLocaleDateString()}`}
                    </span>
                    {data.personalAajKaSawal?.selectedTopic && (
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={() => handleUpdateTopic(null)}
                        className="underline font-bold hover:text-purple-600 cursor-pointer"
                      >
                        Use Standard POTD
                      </button>
                    )}
                  </div>
                )}

                {/* Topic Selector */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                    Select Your POTD Topic (e.g. Binary Search)
                  </label>
                  <input
                    type="text"
                    placeholder="Search topic..."
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white mb-2.5"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                    {filteredTopics.slice(0, 45).map((item) => {
                      const active = selectedTopic.toLowerCase() === item.topic.toLowerCase();
                      return (
                        <button
                          key={item.topic}
                          type="button"
                          onClick={() => setSelectedTopic(item.topic)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            active
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400'
                          }`}
                        >
                          {item.topic} <span className="opacity-65">({item.count})</span>
                        </button>
                      );
                    })}
                    {filteredTopics.length === 0 && (
                      <p className="text-xs text-gray-400 py-2">No matching topics found.</p>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Close
                  </button>
                  {isPersonalActive ? (
                    <button
                      type="button"
                      disabled={submittingAction || !selectedTopic}
                      onClick={() => handleUpdateTopic(selectedTopic)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submittingAction ? 'Updating...' : `Set Topic: ${selectedTopic || 'Choose'}`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submittingAction}
                      onClick={handlePurchasePersonalPlan}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <HaveliCoinIcon size={15} />
                      {submittingAction
                        ? 'Unlocking...'
                        : `Unlock Plan (${data.personalPotdPrice ?? 50} Coins / ${data.personalPotdDurationDays ?? 30}d)`}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
