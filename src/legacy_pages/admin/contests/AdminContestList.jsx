'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Trophy,
  Plus,
  Search,
  Filter,
  Play,
  Square,
  XCircle,
  Copy,
  Edit,
  Trash2,
  Users,
  FileCode,
  Eye,
  RefreshCw,
  Send,
  MoreVertical,
  AlertCircle,
  Ban,
  RotateCcw,
  Crown,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestList() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [contestType, setContestType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal for cancellation
  const [cancelModal, setCancelModal] = useState({ open: false, contestId: null, title: '' });
  const [cancelReason, setCancelReason] = useState('');
  
  // Modal for disabling / banning
  const [disableModal, setDisableModal] = useState({ open: false, contestId: null, title: '' });
  const [disableReason, setDisableReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch dashboard stats & contests
  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, listRes] = await Promise.all([
        axiosInstance.get('/api/admin/contests/overview'),
        axiosInstance.get(`/api/admin/contests?search=${search}&status=${status}&contestType=${contestType}&page=${page}&limit=10`)
      ]);

      if (overviewRes.data.success) {
        setStats(overviewRes.data.stats);
      }
      if (listRes.data.success) {
        setContests(listRes.data.contests);
        setTotalPages(listRes.data.pagination.pages || 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch admin contest data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, status, contestType, page]);

  // Lifecycle action triggers
  const handlePublish = async (contestId) => {
    if (!window.confirm('Publish this contest? It will become visible to users and schedule activation.')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/publish`);
      toast.success(res.data.message || 'Contest published');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish contest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartNow = async (contestId) => {
    if (!window.confirm('Start this contest NOW? Status will transition to LIVE.')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/start`);
      toast.success(res.data.message || 'Contest is now LIVE');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start contest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndNow = async (contestId) => {
    if (!window.confirm('End this contest NOW? Participants will not be able to submit further solutions.')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/end`);
      toast.success(res.data.message || 'Contest ended');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to end contest');
    } finally {
      setActionLoading(false);
    }
  };

  const executeCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please enter a cancellation reason');
      return;
    }
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${cancelModal.contestId}/cancel`, {
        reason: cancelReason.trim()
      });
      toast.success(res.data.message || 'Contest cancelled');
      setCancelModal({ open: false, contestId: null, title: '' });
      setCancelReason('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel contest');
    } finally {
      setActionLoading(false);
    }
  };

  const executeDisable = async () => {
    if (!disableReason.trim()) {
      toast.error('Please enter a reason for disabling this contest');
      return;
    }
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${disableModal.contestId}/disable`, {
        reason: disableReason.trim()
      });
      toast.success(res.data.message || 'Contest disabled successfully');
      setDisableModal({ open: false, contestId: null, title: '' });
      setDisableReason('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disable contest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (contestId) => {
    if (!window.confirm('Restore this disabled contest? It will immediately return to active rotation.')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/restore`, {
        reason: 'Restored by administrator from dashboard'
      });
      toast.success(res.data.message || 'Contest restored successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore contest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async (contestId) => {
    try {
      setActionLoading(true);
      const res = await axiosInstance.post(`/api/admin/contests/${contestId}/duplicate`);
      toast.success('Contest duplicated as draft');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to duplicate contest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (contestId) => {
    if (!window.confirm('Are you sure you want to delete this contest? Note: Contests with submissions cannot be deleted.')) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.delete(`/api/admin/contests/${contestId}`);
      toast.success(res.data.message || 'Contest deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete contest');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span>Contest Management Dashboard</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create, schedule, monitor, and manage competitive programming contests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/contests/scheduler"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Weekly Scheduler</span>
          </Link>

          <Link
            to="/admin/contests/passes"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50/70 dark:bg-gray-900 hover:bg-amber-100/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Contest Passes</span>
          </Link>

          <button
            onClick={fetchData}
            className="p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 transition-colors shadow-xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/admin/contests/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Contest</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-3">
          {[
            { label: 'Total', count: stats.totalContests, color: 'text-gray-900 dark:text-white' },
            { label: 'Scheduled', count: stats.scheduledContests, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Live Now', count: stats.liveContests, color: 'text-red-500 dark:text-red-400' },
            { label: 'Ended', count: stats.endedContests, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Disabled', count: stats.disabledContests || 0, color: 'text-rose-600 dark:text-rose-500 font-black' },
            { label: 'Public', count: stats.publicContests || 0, color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Private', count: stats.privateContests || 0, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Hosts', count: stats.totalHosts || 0, color: 'text-orange-600 dark:text-orange-400' },
            { label: 'Registrations', count: stats.totalRegistrations, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Revenue', count: `₹${stats.totalPassRevenue || 0}`, color: 'text-emerald-600 dark:text-emerald-400 font-mono font-bold' },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-center space-y-1 shadow-xs">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block truncate">{card.label}</span>
              <span className={`text-lg font-black ${card.color}`}>{card.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between text-xs shadow-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contest title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={contestType}
            onChange={(e) => { setContestType(e.target.value); setPage(1); }}
            className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="practice">Practice</option>
          </select>
        </div>
      </div>

      {/* Contests Management Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Contest</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Start Time</th>
                <th className="px-4 py-4">Participants</th>
                <th className="px-4 py-4">Problems</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {contests.length > 0 ? (
                contests.map((c) => (
                  <tr key={c._id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{c.title}</div>
                      <span className="text-[11px] text-gray-500 font-mono">/{c.slug}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        c.status === 'live' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse' :
                        c.status === 'scheduled' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800' :
                        c.status === 'draft' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700' :
                        c.status === 'ended' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' :
                        'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 capitalize text-gray-700 dark:text-gray-300 font-medium">
                      {c.contestType}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      <div>{new Date(c.startTime).toLocaleDateString()}</div>
                      <span className="text-[10px] text-gray-500">{new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-medium">
                      <Link
                        to={`/admin/contests/${c._id}/participants`}
                        className="hover:text-amber-600 dark:hover:text-amber-400 underline underline-offset-2"
                      >
                        {c.registeredCount || 0} registered
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      {c.problemsCount || 0} challenges
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View */}
                        <Link
                          to={`/contests/${c._id}`}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          title="View Contest Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/admin/contests/${c._id}/edit`}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400"
                          title="Edit Contest"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Publish if Draft */}
                        {c.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(c._id)}
                            className="p-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800"
                            title="Publish Contest"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Manual Start if Scheduled */}
                        {c.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartNow(c._id)}
                            className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800"
                            title="Start Contest Now"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Manual End if Live */}
                        {c.status === 'live' && (
                          <button
                            onClick={() => handleEndNow(c._id)}
                            className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800"
                            title="End Contest Now"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Participants List */}
                        <Link
                          to={`/admin/contests/${c._id}/participants`}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-purple-600 dark:text-purple-400"
                          title="Manage Participants"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Link>

                        {/* Submissions */}
                        <Link
                          to={`/admin/contests/${c._id}/submissions`}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-cyan-600 dark:text-cyan-400"
                          title="Monitor Submissions"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </Link>

                        {/* Leaderboard */}
                        <Link
                          to={`/admin/contests/${c._id}/leaderboard`}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-500"
                          title="Contest Leaderboard"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(c._id)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400"
                          title="Duplicate Contest"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Disable / Ban or Restore */}
                        {c.status === 'disabled' ? (
                          <button
                            onClick={() => handleRestore(c._id)}
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                            title="Restore Disabled Contest"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : c.status !== 'cancelled' && (
                          <button
                            onClick={() => setDisableModal({ open: true, contestId: c._id, title: c.title })}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-950 text-rose-500 hover:text-rose-400 border border-transparent hover:border-rose-800"
                            title="Disable / Ban Contest"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Cancel modal */}
                        {c.status !== 'cancelled' && c.status !== 'ended' && c.status !== 'disabled' && (
                          <button
                            onClick={() => setCancelModal({ open: true, contestId: c._id, title: c.title })}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-900 text-rose-400"
                            title="Cancel Contest"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-950 text-gray-500 hover:text-rose-400"
                          title="Delete Contest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No contests found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 disabled:opacity-40 shadow-xs cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 disabled:opacity-40 shadow-xs cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Cancel Contest Modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Contest</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Are you sure you want to cancel <b>{cancelModal.title}</b>? Please provide a mandatory reason for the audit log.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Scheduled system maintenance or scheduling conflict..."
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModal({ open: false, contestId: null, title: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                Close
              </button>
              <button
                disabled={!cancelReason.trim() || actionLoading}
                onClick={executeCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable / Ban Contest Modal */}
      {disableModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-rose-300 dark:border-rose-900/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-rose-600 dark:text-rose-500 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600 dark:text-rose-500" />
              <span>Disable / Ban Contest</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Are you sure you want to disable <b>{disableModal.title}</b>?
              This will immediately block question visibility, deny new submissions, and restrict entry. Existing submissions will be preserved.
            </p>
            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                Reason for Disabling <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
                placeholder="e.g. Plagiarism reported, code leaked, or violation of contest guidelines..."
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-rose-500 resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisableModal({ open: false, contestId: null, title: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                Close
              </button>
              <button
                disabled={!disableReason.trim() || actionLoading}
                onClick={executeDisable}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading ? 'Disabling...' : 'Confirm Disable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
