'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  Users,
  ArrowLeft,
  Search,
  ShieldAlert,
  Ban,
  CheckCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestParticipants() {
  const { contestId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Disqualification Modal State
  const [disqualifyModal, setDisqualifyModal] = useState({ open: false, user: null });
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/admin/contests/${contestId}/participants?search=${search}&status=${status}&page=${page}&limit=15`
      );
      if (res.data.success) {
        setParticipants(res.data.participants);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.pages || 1);
      }
    } catch (err) {
      toast.error('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [contestId, search, status, page]);

  const handleDisqualify = async () => {
    if (!disqualifyReason.trim()) {
      toast.error('Please enter a disqualification reason');
      return;
    }

    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/disqualify`, {
        userId: disqualifyModal.user._id,
        reason: disqualifyReason.trim()
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Participant disqualified');
        setDisqualifyModal({ open: false, user: null });
        setDisqualifyReason('');
        fetchParticipants();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disqualify participant');
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
              <Users className="w-6 h-6 text-amber-500" />
              <span>Contest Participants</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Registered: {total}</p>
          </div>
        </div>

        <button
          onClick={fetchParticipants}
          className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by participant name, username or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none transition-colors"
        >
          <option value="all">All Participation Statuses</option>
          <option value="registered">Registered</option>
          <option value="participating">Participating</option>
          <option value="disqualified">Disqualified</option>
        </select>
      </div>

      {/* Participants Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Participant</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Registered At</th>
                <th className="px-4 py-4">Submissions</th>
                <th className="px-4 py-4">Solved</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Rank</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {participants.length > 0 ? (
                participants.map((p) => (
                  <tr key={p._id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.04] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={p.user?.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">{p.user?.name || 'User'}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">@{p.user?.username} • {p.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        p.isDisqualified ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                        p.participationStatus === 'participating' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}>
                        {p.isDisqualified ? 'Disqualified' : p.participationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(p.registeredAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-mono">
                      {p.submissionCount}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-mono">
                      {p.problemsSolved}
                    </td>
                    <td className="px-4 py-4 font-black text-amber-600 dark:text-amber-400 text-sm">
                      {p.totalScore} pts
                    </td>
                    <td className="px-4 py-4 font-bold text-amber-600 dark:text-amber-400">
                      {p.rank ? `#${p.rank}` : '-'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!p.isDisqualified && (
                        <button
                          onClick={() => setDisqualifyModal({ open: true, user: p.user })}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Disqualify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No participants registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disqualify Modal */}
      {disqualifyModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Disqualify Participant</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Are you sure you want to disqualify <b>{disqualifyModal.user?.name}</b> (@{disqualifyModal.user?.username})?
              Their submissions will be retained for audit records, but their score and rank will be zeroed.
            </p>
            <textarea
              rows={3}
              required
              value={disqualifyReason}
              onChange={(e) => setDisqualifyReason(e.target.value)}
              placeholder="Mandatory reason (e.g. plagiarism detected, unauthorized assistance)..."
              className="w-full bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-rose-500 transition-colors"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisqualifyModal({ open: false, user: null })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!disqualifyReason.trim() || actionLoading}
                onClick={handleDisqualify}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {actionLoading ? 'Processing...' : 'Confirm Disqualification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
