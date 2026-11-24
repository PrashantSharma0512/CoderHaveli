'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronUp
} from 'lucide-react';
import axiosInstance from '@/components/helper/axiosInstance';
import CodeTapasyaCalendar from './CodeTapasyaCalendar';

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

  // Fetch today's problem
  useEffect(() => {
    let isMounted = true;
    const fetchToday = async () => {
      try {
        const url = `/api/daily/aaj-ka-sawal${userId ? `?userId=${userId}` : ''}`;
        const res = await axiosInstance.get(url);
        if (isMounted && res.data?.success && res.data?.data) {
          setData(res.data.data);
          setSecondsLeft(res.data.data.secondsUntilNext || 0);
        }
      } catch (err) {
        console.error('Failed to fetch AajKaSawal:', err);
        if (isMounted) {
          setData({
            quesId: '11',
            quesName: 'Container With Most Water',
            difficulty: 'Medium',
            tags: ['Array', 'Two Pointers', 'Greedy'],
            descriptionSnippet: 'Find two lines that together with the x-axis form a container that contains the most water.',
            catchyQuote: 'Consistency is the Key — Solve Today\'s Challenge!',
            totalSolves: 128,
            secondsUntilNext: 28800,
            userStreak: 0,
            isSolvedToday: false
          });
          setSecondsLeft(28800);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchToday();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Live countdown timer ticking every second
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
  };

  const getDifficultyColor = (diff: string = '') => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
      case 'hard':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800';
      case 'medium':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800';
    }
  };

  // Ensure clean Pan-India English quotes even with legacy DB records
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
      return 'Consistency is the Key — Solve Today\'s Challenge!';
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

  // Resolve target problem route identifier: prefer MongoDB _id, fallback to quesId
  const targetId =
    data.problemId ||
    data.problemObjectId ||
    (typeof data.problemRef === 'object' ? data.problemRef?._id : data.problemRef) ||
    data._id ||
    data.quesId;

  const problemHref = `/problem/${targetId}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-amber-300/80 dark:border-amber-800/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10 dark:from-amber-950/30 dark:via-gray-900 dark:to-orange-950/20 shadow-lg shadow-amber-500/10 backdrop-blur-md transition-all ${className}`}
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Problem of the Day
              </span>

              {/* Streak Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 animate-bounce" />
                {data.userStreak || 0} Day Streak
              </span>

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
                <span className="text-amber-600 dark:text-amber-400">{formatTime(secondsLeft)}</span>
              </div>
            </div>
          </div>

          {/* Motivational Tagline in Clean English */}
          <div className="mb-2">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span>✨</span>
              <span>{getCleanQuote(data.catchyQuote)}</span>
            </p>
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
              {/* Tags */}
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

              {/* Total solves */}
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
        <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
          <div className="flex items-center gap-2">
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
            #DailyCoding • One Challenge Every Day
          </span>
        </div>
      </div>

      {/* Expandable Calendar (if toggle enabled) */}
      {showCalendarToggle && showCalendar && (
        <div className="p-4 bg-white/40 dark:bg-black/20 border-t border-amber-200/80 dark:border-amber-900/60 animate-fadeIn">
          <CodeTapasyaCalendar userId={userId} />
        </div>
      )}
    </div>
  );
}
