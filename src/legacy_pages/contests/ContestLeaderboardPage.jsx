'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Trophy, ArrowLeft, RefreshCw, Medal, Clock, Award, ShieldAlert } from 'lucide-react';
import axiosInstance from '../../components/helper/axiosInstance';

export default function ContestLeaderboardPage() {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [contestTitle, setContestTitle] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/api/contests/${contestId}/leaderboard`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
        setContestTitle(res.data.contestTitle || 'Contest Leaderboard');
        setStatus(res.data.status || '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contest leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [contestId]);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
          <div className="space-y-1">
            <Link
              to={`/contests/${contestId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Contest</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>{contestTitle} Leaderboard</span>
            </h1>
          </div>

          <button
            onClick={fetchLeaderboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold shadow-sm hover:text-amber-500 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ranks</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-bold text-gray-400">Loading live rankings...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-3xl text-center space-y-3 max-w-md mx-auto">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400">{error}</h3>
          </div>
        ) : (
          <>
            {/* Top 3 Podium if at least 2 participants */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 pb-2 items-end">
                {/* #2 Rank */}
                {top3[1] && (
                  <div className="order-2 sm:order-1 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto flex items-center justify-center font-black text-xl text-slate-700 dark:text-slate-200 border-4 border-slate-300 dark:border-slate-600">
                      🥈
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white truncate">
                        {top3[1].user?.name}
                      </h4>
                      <p className="text-xs text-gray-400">@{top3[1].user?.username || 'user'}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="font-black text-lg text-amber-500">{top3[1].totalScore} pts</span>
                      <span className="text-[11px] text-gray-400 block">{top3[1].penaltyTime}m penalty</span>
                    </div>
                  </div>
                )}

                {/* #1 Rank (Crown) */}
                {top3[0] && (
                  <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900 rounded-3xl p-7 border-2 border-amber-400 dark:border-amber-600/60 shadow-xl text-center space-y-3 sm:-translate-y-4">
                    <div className="text-2xl animate-bounce">👑</div>
                    <div className="w-20 h-20 rounded-full bg-amber-500 mx-auto flex items-center justify-center font-black text-2xl text-white border-4 border-amber-300 dark:border-amber-700 shadow-md">
                      🥇
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-gray-950 dark:text-white truncate">
                        {top3[0].user?.name}
                      </h3>
                      <p className="text-xs text-gray-400">@{top3[0].user?.username || 'champion'}</p>
                    </div>
                    <div className="pt-2 border-t border-amber-100 dark:border-gray-800">
                      <span className="font-black text-2xl text-amber-600 dark:text-amber-400">{top3[0].totalScore} pts</span>
                      <span className="text-xs text-gray-400 block">{top3[0].problemsSolved} problems solved</span>
                    </div>
                  </div>
                )}

                {/* #3 Rank */}
                {top3[2] && (
                  <div className="order-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 mx-auto flex items-center justify-center font-black text-xl text-amber-800 dark:text-amber-300 border-4 border-amber-200 dark:border-amber-800">
                      🥉
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white truncate">
                        {top3[2].user?.name}
                      </h4>
                      <p className="text-xs text-gray-400">@{top3[2].user?.username || 'coder'}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="font-black text-lg text-amber-500">{top3[2].totalScore} pts</span>
                      <span className="text-[11px] text-gray-400 block">{top3[2].penaltyTime}m penalty</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rankings Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm dark:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 text-gray-500 uppercase tracking-wider font-black">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Participant</th>
                      <th className="px-6 py-4">Problems Solved</th>
                      <th className="px-6 py-4">Penalty Time</th>
                      <th className="px-6 py-4 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leaderboard.map((row) => (
                      <tr key={row._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4 font-black text-sm">
                          <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center ${
                            row.rank === 1 ? 'bg-amber-400 text-black' :
                            row.rank === 2 ? 'bg-slate-300 text-black' :
                            row.rank === 3 ? 'bg-amber-700 text-white' : 'text-gray-500'
                          }`}>
                            #{row.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={row.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                              alt={row.user?.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span>{row.user?.name}</span>
                              <span className="block text-[11px] text-gray-400">@{row.user?.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                          {row.problemsSolved} Solved
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500">
                          {row.penaltyTime} Mins
                        </td>
                        <td className="px-6 py-4 text-right font-black text-amber-500 text-sm">
                          {row.totalScore} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
