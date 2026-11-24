'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Trophy,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import axiosInstance from '@/components/helper/axiosInstance';

interface DayProblemInfo {
  quesId: string;
  quesName: string;
  difficulty: string;
  problemId?: string;
}

interface CalendarData {
  currentStreak: number;
  longestStreak: number;
  totalDaysSolved: number;
  lastSolvedDate: string | null;
  isTodaySolved: boolean;
  solvedDates: string[];
  dailyProblems?: Record<string, DayProblemInfo>;
  todayDate: string;
  year: number;
  month: number;
}

interface CodeTapasyaCalendarProps {
  userId?: string;
  className?: string;
  onSelectDate?: (dateStr: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Client fallback problem dictionary in case backend is offline
const FALLBACK_ROTATION: DayProblemInfo[] = [
  { quesId: '11', quesName: 'Container With Most Water', difficulty: 'Medium' },
  { quesId: '1', quesName: 'Two Sum', difficulty: 'Easy' },
  { quesId: '3', quesName: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
  { quesId: '15', quesName: '3Sum', difficulty: 'Medium' },
  { quesId: '20', quesName: 'Valid Parentheses', difficulty: 'Easy' },
  { quesId: '53', quesName: 'Maximum Subarray', difficulty: 'Medium' },
  { quesId: '121', quesName: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
  { quesId: '70', quesName: 'Climbing Stairs', difficulty: 'Easy' },
  { quesId: '42', quesName: 'Trapping Rain Water', difficulty: 'Hard' },
  { quesId: '2', quesName: 'Add Two Numbers', difficulty: 'Medium' },
  { quesId: '4', quesName: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
  { quesId: '5', quesName: 'Longest Palindromic Substring', difficulty: 'Medium' },
  { quesId: '7', quesName: 'Reverse Integer', difficulty: 'Medium' }
];

export default function CodeTapasyaCalendar({
  userId,
  className = '',
  onSelectDate
}: CodeTapasyaCalendarProps) {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const fetchCalendar = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const url = `/api/daily/calendar?year=${year}&month=${month}${userId ? `&userId=${userId}` : ''}`;
      const res = await axiosInstance.get(url);
      if (res.data?.success && res.data?.data) {
        setCalendarData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch Code Tapasya calendar:', err);
      const fallbackToday = new Date().toISOString().split('T')[0];
      setCalendarData({
        currentStreak: 0,
        longestStreak: 0,
        totalDaysSolved: 0,
        lastSolvedDate: null,
        isTodaySolved: false,
        solvedDates: [],
        todayDate: fallbackToday,
        year,
        month
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCalendar(currentYear, currentMonth);
  }, [fetchCalendar, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const startingDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday-first
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const todayStr = calendarData?.todayDate || new Date().toISOString().split('T')[0];
  const solvedSet = new Set(calendarData?.solvedDates || []);

  // Helper to get problem info for a specific date
  const getProblemForDate = (dateStr: string, dayNum: number): DayProblemInfo => {
    if (calendarData?.dailyProblems && calendarData.dailyProblems[dateStr]) {
      return calendarData.dailyProblems[dateStr];
    }
    // Fallback deterministic problem
    const dateObj = new Date(Date.UTC(currentYear, currentMonth - 1, dayNum));
    const daysSinceEpoch = Math.floor(dateObj.getTime() / 86400000);
    return FALLBACK_ROTATION[Math.abs(daysSinceEpoch) % FALLBACK_ROTATION.length];
  };

  // Default active preview to today's problem or selected
  const activeDateKey = activeDate || todayStr;
  const activeDayNum = parseInt(activeDateKey.split('-')[2] || '1', 10);
  const activeProblem = getProblemForDate(activeDateKey, activeDayNum);
  const isActiveSolved = solvedSet.has(activeDateKey);
  const isActivePast = activeDateKey < todayStr;

  const handleCellClick = (dateStr: string, isFuture: boolean, prob: DayProblemInfo) => {
    if (isFuture) return;
    setActiveDate(dateStr);
    if (onSelectDate) onSelectDate(dateStr);
    const target = prob.problemId || prob.quesId;
    if (target) {
      router.push(`/problem/${target}`);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 shadow-lg shadow-amber-500/5 backdrop-blur-sm transition-all ${className}`}
    >
      {/* Compact Top Header: Title & Month Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500 text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
              Code Tapasya
              {calendarData?.isTodaySolved && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  ✓ Done
                </span>
              )}
            </h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">Streak Calendar</span>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevMonth}
            disabled={loading}
            className="p-1 rounded hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 px-1 min-w-[70px] text-center">
            {MONTH_NAMES[currentMonth - 1].slice(0, 3)} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            disabled={loading}
            className="p-1 rounded hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Compact Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 my-2.5">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-300/60 dark:border-amber-700/40">
          <Flame className="w-3 h-3 text-amber-600 fill-amber-500 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400 block leading-none">
              Streak
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white leading-tight">
              {calendarData?.currentStreak ?? 0} <span className="text-[9px] font-normal text-gray-500">Days</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-300/60 dark:border-purple-700/40">
          <Trophy className="w-3 h-3 text-purple-600 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] uppercase font-bold text-purple-700 dark:text-purple-400 block leading-none">
              Max
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white leading-tight">
              {calendarData?.longestStreak ?? 0} <span className="text-[9px] font-normal text-gray-500">Days</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-300/60 dark:border-emerald-700/40">
          <Target className="w-3 h-3 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block leading-none">
              Solved
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white leading-tight">
              {calendarData?.totalDaysSolved ?? 0} <span className="text-[9px] font-normal text-gray-500">Total</span>
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full">
        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
          {DAY_LABELS.map((day) => (
            <div key={day} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leading empty offset */}
          {Array.from({ length: startingDayOffset }, (_, i) => (
            <div key={`offset-${i}`} className="h-7 sm:h-8 rounded-lg bg-transparent pointer-events-none opacity-0" />
          ))}

          {/* Month Day Cells */}
          {daysArray.map((dayNum) => {
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSolved = solvedSet.has(dateStr);
            const isPast = dateStr < todayStr;
            const isFuture = dateStr > todayStr;
            const isSelected = activeDate === dateStr;

            const prob = getProblemForDate(dateStr, dayNum);

            // Determine cell visual style
            let cellStyle = '';
            if (isFuture) {
              cellStyle = 'opacity-30 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/20 cursor-default';
            } else if (isSolved) {
              // Fired day (Fiery gradient with flame!)
              cellStyle =
                'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white font-black shadow-xs shadow-orange-500/40 ring-1 ring-orange-300 scale-100 hover:scale-105 cursor-pointer';
            } else if (isPast) {
              // Red color for missed / unsolved past days as requested!
              cellStyle =
                'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-bold cursor-pointer';
            } else if (isToday) {
              // Active today
              cellStyle =
                'border-2 border-amber-500 bg-amber-100/70 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-black ring-2 ring-amber-400/40 animate-pulse cursor-pointer';
            }

            return (
              <div
                key={dateStr}
                onMouseEnter={() => !isFuture && setActiveDate(dateStr)}
                onClick={() => handleCellClick(dateStr, isFuture, prob)}
                className={`relative group h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center transition-all ${cellStyle} ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Cell Content */}
                {isSolved ? (
                  <div className="flex items-center justify-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-white text-white shrink-0" />
                    <span className="text-[11px] font-black leading-none">{dayNum}</span>
                  </div>
                ) : (
                  <span className="text-[11px] leading-none">{dayNum}</span>
                )}

                {/* Red dot indicator for missed past day */}
                {isPast && !isSolved && (
                  <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-rose-500" />
                )}

                {/* Rich Tooltip on Hover */}
                {!isFuture && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-800 text-white text-[10px] rounded-lg p-2 shadow-xl border border-gray-700 whitespace-nowrap min-w-[150px] text-center">
                      <div className="font-bold text-gray-300">
                        {MONTH_NAMES[currentMonth - 1]} {dayNum}, {currentYear}
                      </div>
                      <div className="font-extrabold text-amber-400 truncate max-w-[180px]">
                        {prob.quesName}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[9px]">
                        <span className="px-1.5 py-0.2 rounded bg-gray-700 text-gray-200">
                          {prob.difficulty}
                        </span>
                        {isSolved ? (
                          <span className="text-amber-400 font-bold">🔥 Solved</span>
                        ) : isToday ? (
                          <span className="text-amber-300 font-bold">⚡ Today</span>
                        ) : (
                          <span className="text-rose-400 font-bold">🔴 Missed</span>
                        )}
                      </div>
                      <div className="text-[8px] text-gray-400 mt-0.5">Click to open question →</div>
                    </div>
                    {/* Tooltip triangle */}
                    <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Problem Preview Strip */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
              <span>{activeDateKey}</span>
              <span>•</span>
              <span
                className={`px-1 rounded text-[9px] font-bold uppercase ${
                  activeProblem.difficulty?.toLowerCase() === 'easy'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : activeProblem.difficulty?.toLowerCase() === 'hard'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                }`}
              >
                {activeProblem.difficulty}
              </span>
              <span>•</span>
              {isActiveSolved ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-amber-500" /> Solved
                </span>
              ) : isActivePast ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">🔴 Missed</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold">⚡ Today</span>
              )}
            </div>
            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {activeProblem.quesName}
            </div>
          </div>

          <Link
            href={`/problem/${activeProblem.problemId || activeProblem.quesId}`}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>Solve</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-amber-500 to-orange-500 inline-block shadow-xs" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Fired (Solved)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300 text-rose-500 inline-block" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-100 border-2 border-amber-500 inline-block" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Today</span>
          </div>
        </div>

        <span className="font-bold text-amber-700 dark:text-amber-400 hidden sm:inline">
          Click any date to solve
        </span>
      </div>
    </div>
  );
}
