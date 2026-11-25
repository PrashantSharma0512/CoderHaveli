'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  Trophy,
  Crown,
  Medal,
  Search,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import axiosInstance from '@/components/helper/axiosInstance';
import HaveliCoinIcon from '@/components/common/HaveliCoinIcon';

interface LeaderboardEntry {
  rank: number;
  _id: string;
  name: string;
  username: string;
  avatar: string | null;
  haveliCoins: number;
  solvedCount: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  score: number;
  acceptanceRate: number;
  currentStreak: number;
  longestStreak: number;
}

interface MyRankInfo {
  rank: number;
  totalUsers: number;
  topPercent: number;
  solvedCount: number;
  score: number;
  haveliCoins: number;
}

export default function LeaderboardClient() {
  const userId = useSelector((state: any) => state?.login?.userId);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRankInfo | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (userId) params.set('userId', userId);

      const res = await axiosInstance.get(`/api/leaderboard?${params.toString()}`);
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setEntries(d.entries || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
        setMyRank(d.myRank || null);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, userId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const topThree = page === 1 && !debouncedSearch ? entries.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              CoderHaveli Global Leaderboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Tapasya Ranks
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Consistency meets mastery — ranked by Problems Solved, Difficulty Score (Easy 10 • Med 25 • Hard 50), and Haveli Coins.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coder name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* My Rank Banner (if logged in) */}
        {myRank && (
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border-2 border-amber-400/70 dark:border-amber-500/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Rank</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">#{myRank.rank}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-gray-900 dark:text-white">Your Global Standing</h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Top {myRank.topPercent}% of {myRank.totalUsers} Coders
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Solve more DSA challenges &amp; weekly contests to climb the ranks!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{myRank.solvedCount}</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Solved</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-sm font-black text-amber-600 dark:text-amber-400">{myRank.score}</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Score</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5">
                <HaveliCoinIcon size={18} />
                <span className="text-sm font-black text-gray-900 dark:text-white">{myRank.haveliCoins}</span>
              </div>
              <Link
                href="/profile"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}

        {/* Top 3 Podium Cards */}
        {!loading && topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topThree.map((coder) => {
              const isFirst = coder.rank === 1;
              const isSecond = coder.rank === 2;
              const borderClass = isFirst
                ? 'border-amber-400 dark:border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                : isSecond
                  ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900'
                  : 'border-orange-300 dark:border-orange-800 bg-white dark:bg-gray-900';

              return (
                <div
                  key={coder._id}
                  className={`relative p-5 rounded-3xl border-2 ${borderClass} shadow-sm flex flex-col justify-between`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        {coder.avatar ? (
                          <img
                            src={coder.avatar}
                            alt={coder.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-xs"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-gray-800 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-amber-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-gray-900 dark:text-white truncate">{coder.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">@{coder.username}</div>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                        isFirst
                          ? 'bg-amber-500 text-white'
                          : isSecond
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                            : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300'
                      }`}
                    >
                      {isFirst ? <Crown className="w-3.5 h-3.5" /> : <Medal className="w-3.5 h-3.5" />}
                      #{coder.rank}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200/70 dark:border-gray-800 text-center">
                    <div>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{coder.solvedCount}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Solved</div>
                    </div>
                    <div>
                      <div className="text-base font-black text-amber-600 dark:text-amber-400">{coder.score}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Score</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1">
                        <HaveliCoinIcon size={15} />
                        <span>{coder.haveliCoins}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Coins</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-gray-800/60 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-4 w-20">Rank</th>
                  <th className="px-5 py-4">Coder</th>
                  <th className="px-5 py-4">Solved</th>
                  <th className="px-5 py-4 hidden md:table-cell">Breakdown (E / M / H)</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4 hidden sm:table-cell">Streak</th>
                  <th className="px-5 py-4 text-right">Haveli Coins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-5 py-4"><div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4 hidden sm:table-cell"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" /></td>
                      <td className="px-5 py-4 text-right"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                      No coders found matching your search.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isMe = userId && String(userId) === String(entry._id);
                    return (
                      <tr
                        key={entry._id}
                        className={`transition-colors ${
                          isMe
                            ? 'bg-amber-50/80 dark:bg-amber-950/30'
                            : 'hover:bg-slate-50/70 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <td className="px-5 py-4 font-black text-gray-900 dark:text-white">
                          #{entry.rank}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {entry.avatar ? (
                              <img
                                src={entry.avatar}
                                alt={entry.name}
                                className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                <UserIcon className="w-4 h-4 text-amber-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                                <span>{entry.name}</span>
                                {isMe && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">@{entry.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {entry.solvedCount}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                              {entry.easySolved}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                              {entry.mediumSolved}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                              {entry.hardSolved}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-black text-gray-900 dark:text-white">
                          {entry.score}
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                            <Flame className="w-3.5 h-3.5 fill-orange-500" />
                            {entry.currentStreak}d
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                            <HaveliCoinIcon size={16} />
                            <span>{entry.haveliCoins}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Page {page} of {totalPages} • {total} Coders
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

