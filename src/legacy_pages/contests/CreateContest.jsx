'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  Lock,
  Globe,
  Plus,
  X,
  Search,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../components/helper/axiosInstance';

export default function CreateContest() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.login || {});

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contestType, setContestType] = useState('private');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60); // minutes
  const [submitting, setSubmitting] = useState(false);

  // Hosting Entitlement state
  const [entitlement, setEntitlement] = useState({
    defaultLimit: 5,
    effectiveLimit: 5,
    hasActivePass: false,
    activePlan: null
  });
  const [loadingEntitlement, setLoadingEntitlement] = useState(true);

  // Participant Invitation state
  const [friendSearch, setFriendSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingFriends, setSearchingFriends] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]); // Array of user objects

  // Problem Selection state
  const [problemSearch, setProblemSearch] = useState('');
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]); // Array of problem objects
  const [loadingProblems, setLoadingProblems] = useState(false);

  // 1. Fetch user hosting entitlement
  const fetchEntitlement = async () => {
    try {
      setLoadingEntitlement(true);
      const res = await axiosInstance.get('/api/contests/user/hosting-entitlement');
      if (res.data?.success) {
        setEntitlement({
          defaultLimit: res.data.defaultParticipantLimit || 5,
          effectiveLimit: res.data.effectiveParticipantLimit || 5,
          hasActivePass: res.data.hasActivePass || false,
          activePlan: res.data.activePlan || null
        });
      }
    } catch (err) {
      console.error('Error fetching entitlement:', err);
    } finally {
      setLoadingEntitlement(false);
    }
  };

  // 2. Fetch problems for selection
  const fetchProblems = async () => {
    try {
      setLoadingProblems(true);
      const res = await axiosInstance.get('/api/contests'); // or problems endpoint
      // We also query public contest problem references or general questions
      const probRes = await axiosInstance.get('/api/admin/contests/scheduler/preview').catch(() => null);
      if (probRes?.data?.preview?.problems) {
        setAllProblems(probRes.data.preview.problems);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    fetchEntitlement();
    fetchProblems();

    // Default start time: 30 minutes from now formatted for datetime-local
    const d = new Date(Date.now() + 30 * 60000);
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setStartTime(localIso);
  }, []);

  // 3. Search users for invitation
  useEffect(() => {
    if (!friendSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearchingFriends(true);
        const res = await axiosInstance.get(`/api/contests/friends/search?search=${encodeURIComponent(friendSearch.trim())}`);
        if (res.data?.success) {
          // Exclude already invited users and the host themselves
          const filtered = res.data.users.filter(
            u => u._id !== user?._id && !invitedUsers.some(inv => inv._id === u._id)
          );
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error('User search error:', err);
      } finally {
        setSearchingFriends(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [friendSearch, invitedUsers]);

  // Total participants count = 1 (host) + invited users
  const totalParticipants = 1 + invitedUsers.length;
  const isLimitReached = totalParticipants >= entitlement.effectiveLimit;
  const remainingSlots = Math.max(0, entitlement.effectiveLimit - totalParticipants);

  const handleAddFriend = (u) => {
    if (isLimitReached) {
      toast.error(`Participant limit reached (${entitlement.effectiveLimit}). Upgrade your Contest Pass to invite more!`);
      return;
    }
    setInvitedUsers(prev => [...prev, u]);
    setFriendSearch('');
    setSearchResults([]);
  };

  const handleRemoveFriend = (userId) => {
    setInvitedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Contest name is required');
      return;
    }
    if (!startTime) {
      toast.error('Please specify a start time');
      return;
    }
    if (new Date(startTime) <= new Date()) {
      toast.error('Start time must be in the future');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        contestType,
        startTime: new Date(startTime).toISOString(),
        duration: Number(duration),
        invitedUserIds: invitedUsers.map(u => u._id),
        problems: selectedProblems.map((p, idx) => ({
          problem: p.problem || p._id,
          points: (idx + 1) * 100,
          order: idx + 1
        }))
      };

      const res = await axiosInstance.post('/api/contests', payload);
      if (res.data?.success) {
        toast.success('Contest created successfully!');
        navigate(`/contests/${res.data.contest._id}`);
      } else {
        toast.error(res.data?.message || 'Failed to create contest');
      }
    } catch (err) {
      console.error('Create contest error:', err);
      toast.error(err.response?.data?.message || 'Failed to create contest');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Link to="/contests" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Contests</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-200">Host Contest</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              <span>Host a Coding Contest</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a competitive coding arena, invite friends, and battle on algorithmic challenges.
            </p>
          </div>

          <Link
            to="/contests/pass"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Contest Pass Benefits</span>
          </Link>
        </div>

        {/* Hosting Entitlement Banner */}
        <div className={`p-5 rounded-2xl border ${
          entitlement.hasActivePass
            ? 'bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/40'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
        } relative overflow-hidden shadow-sm`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Your Hosting Capacity</span>
                {entitlement.hasActivePass ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {entitlement.activePlan?.name || 'Active Contest Pass'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    Free Tier
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                You can host up to <strong className="text-amber-600 dark:text-amber-400 text-base">{entitlement.effectiveLimit} participants</strong> per private contest.
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">(Host is included in limit)</span>
              </p>
            </div>

            <div className="text-right flex items-center gap-3">
              <div className="bg-slate-50 dark:bg-gray-950 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Slots Added</span>
                <span className={`text-base font-black ${isLimitReached ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {totalParticipants} / {entitlement.effectiveLimit}
                </span>
              </div>

              {!entitlement.hasActivePass && (
                <Link
                  to="/contests/pass"
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  Upgrade Pass
                </Link>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-950 h-2 rounded-full mt-4 overflow-hidden border border-gray-200 dark:border-gray-800">
            <div
              className={`h-full transition-all duration-300 ${
                isLimitReached ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (totalParticipants / entitlement.effectiveLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Contest Details</span>
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                Contest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Friday Night DSA Clash #1"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-sm transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                Description & Guidelines
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Rules, contest instructions, and code submission guidelines..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-sm resize-none transition-colors"
              />
            </div>

            {/* Visibility Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setContestType('private')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  contestType === 'private'
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${contestType === 'private' ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Private Contest (Recommended)</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Invite-only. Only invited participants can view questions and submit.</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setContestType('public')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  contestType === 'public'
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${contestType === 'public' ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Public Contest</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Visible to everyone in the CoderHaveli community.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                  Start Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-sm transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                  Duration (Minutes) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-sm transition-colors"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                  <option value={90}>90 Minutes (1.5 Hours)</option>
                  <option value={120}>120 Minutes (2 Hours)</option>
                  <option value={180}>180 Minutes (3 Hours)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Participant Invitation Section */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>Invite Participants</span>
              </h2>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                isLimitReached
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                  : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
              }`}>
                {totalParticipants} / {entitlement.effectiveLimit} slots used
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                disabled={isLimitReached}
                placeholder={isLimitReached ? "Participant limit reached. Upgrade pass to invite more." : "Search users by username or name to invite..."}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              {searchingFriends && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {searchResults.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleAddFriend(u)}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          {u.name?.charAt(0) || u.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{u.username}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Invite
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Limit Warning when reached */}
            {isLimitReached && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-bold text-rose-700 dark:text-rose-300">
                    You have reached your hosting limit ({entitlement.effectiveLimit} participants).
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Free hosting allows up to 5 participants. Purchase a Contest Pass to increase capacity up to 50+ participants or unlimited hosting.
                  </p>
                  <Link
                    to="/contests/pass"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:underline mt-2 transition-colors"
                  >
                    <span>View Contest Pass Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Invited Chips */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                Confirmed Participant Roster ({totalParticipants})
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {/* Host badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{user?.name || 'You'} (Host)</span>
                </div>

                {/* Invited user chips */}
                {invitedUsers.map((inv) => (
                  <div
                    key={inv._id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium group hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <span>{inv.name || `@${inv.username}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(inv._id)}
                      className="text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove invitation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/contests"
              className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-xs font-bold transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Contest...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Create Contest</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
