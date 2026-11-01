'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  Trophy,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Send,
  DatabaseZap,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestLeaderboard() {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [contestTitle, setContestTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/contests/${contestId}/leaderboard`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
        setContestTitle(res.data.contestTitle || 'Leaderboard');
      }
    } catch (err) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [contestId]);

  const handlePublishResults = async () => {
    if (!window.confirm('Finalize and officially publish final results for this contest?')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/publish-results`);
      toast.success(res.data.message || 'Official contest results published!');
      fetchLeaderboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish results');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRebuildLeaderboard = async () => {
    if (!window.confirm('Recompute and rebuild all participant ranks from raw submission documents?')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/rebuild-leaderboard`);
      toast.success(res.data.message || 'Leaderboard rebuilt successfully');
      fetchLeaderboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rebuild leaderboard');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/contests"
            className="p-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>{contestTitle} Leaderboard Management</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Audit rankings, rebuild scores from persistent submissions, and publish official results.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={actionLoading}
            onClick={handleRebuildLeaderboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            title="Rebuild leaderboard from submissions"
          >
            <DatabaseZap className="w-3.5 h-3.5" />
            <span>Rebuild Scores</span>
          </button>

          <button
            disabled={actionLoading}
            onClick={handlePublishResults}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Final Results</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Participant</th>
                <th className="px-4 py-4">Solved Problems</th>
                <th className="px-4 py-4">Penalty Time</th>
                <th className="px-4 py-4">Last Solved At</th>
                <th className="px-5 py-4 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {leaderboard.length > 0 ? (
                leaderboard.map((item) => (
                  <tr key={item._id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.04] transition-colors">
                    <td className="px-5 py-4 font-black">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center ${
                        item.rank === 1 ? 'bg-amber-400 text-black font-black' :
                        item.rank === 2 ? 'bg-slate-200 dark:bg-slate-300 text-black font-black' :
                        item.rank === 3 ? 'bg-amber-700 text-white font-black' :
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        #{item.rank}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={item.user?.name}
                          className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">{item.user?.name || 'Participant'}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">@{item.user?.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-mono">
                      {item.problemsSolved} Solved
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400 font-mono">
                      {item.penaltyTime} Minutes
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {item.lastAcceptedAt ? new Date(item.lastAcceptedAt).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-5 py-4 text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                      {item.totalScore} Pts
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No leaderboard scores recorded for this contest.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
