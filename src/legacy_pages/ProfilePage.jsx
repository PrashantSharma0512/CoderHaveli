'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RiAccountCircleLine, RiCameraFill } from 'react-icons/ri';
import { FaSave, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import {
  Sparkles,
  History,
  ArrowRight,
  Flame,
  CheckCircle2,
  Target,
  Award,
  Trophy,
  Clock,
  Code2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from '../components/helper/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { userAvatar } from '../store/slice/authSlice';
import HaveliCoinIcon from '../components/common/HaveliCoinIcon';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coinSummary, setCoinSummary] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { userId } = useSelector((state) => state?.login);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, coinsRes, statsRes] = await Promise.all([
          axiosInstance.get(`/api/get-profile?id=${userId}`),
          axiosInstance.get('/api/daily/coins').catch(() => null),
          axiosInstance.get('/api/problem/user-stats').catch(() => null)
        ]);

        const userData = profileRes.data?.user || {
          name: '',
          email: '',
          username: '',
          bio: '',
          phone: '',
          avatar: null,
          createdAt: new Date().toISOString()
        };
        dispatch(userAvatar(userData.avatar));
        setUser(userData);
        setAvatarPreview(userData.avatar);
        reset(userData);

        if (coinsRes?.data?.success && coinsRes.data?.data) {
          setCoinSummary(coinsRes.data.data);
        }
        if (statsRes?.data?.success && statsRes.data?.data) {
          setProblemStats(statsRes.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch profile data');
        console.error('Error:', error);
        setUser({
          name: '',
          email: '',
          username: '',
          bio: '',
          phone: '',
          avatar: null,
          createdAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, reset, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const updateData = {
        id: userId,
        name: data.name || user.name,
        bio: data.bio || user.bio,
        phone: data.phone || user.phone
      };

      const fileInput = document.getElementById('avatar-upload');
      if (fileInput?.files?.[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        const base64Avatar = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
        updateData.avatar = base64Avatar;
      }

      const response = await axiosInstance.put('/api/update-profile', updateData);
      const updatedUser = response.data?.user || user;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset(user);
      setAvatarPreview(user.avatar);
    }
    setIsEditing(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
          <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm">Loading your CoderHaveli profile...</p>
        </div>
      </div>
    );
  }

  // Coding Mastery Calculations
  const solvedCount = problemStats?.solvedCount ?? 0;
  const totalProblems = problemStats?.totalProblems || 1;
  const attemptingCount = problemStats?.attemptingCount ?? 0;
  const acceptanceRate = problemStats?.acceptanceRate ?? 0;
  const totalSubmissions = problemStats?.totalSubmissions ?? 0;

  const easy = problemStats?.difficulty?.easy || { solved: 0, total: 0 };
  const medium = problemStats?.difficulty?.medium || { solved: 0, total: 0 };
  const hard = problemStats?.difficulty?.hard || { solved: 0, total: 0 };

  const completionPct = totalProblems > 0 ? Math.min(100, Number(((solvedCount / totalProblems) * 100).toFixed(1))) : 0;

  // Segmented Hex-Arc SVG geometry (unique CoderHaveli Mastery Shield Gauge)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const easyArc = totalProblems > 0 ? (easy.solved / totalProblems) * circumference : 0;
  const medArc = totalProblems > 0 ? (medium.solved / totalProblems) * circumference : 0;
  const hardArc = totalProblems > 0 ? (hard.solved / totalProblems) * circumference : 0;

  const currentStreak = problemStats?.streak?.currentStreak ?? 0;
  const longestStreak = problemStats?.streak?.longestStreak ?? 0;
  const haveliCoins = coinSummary?.haveliCoins ?? user.haveliCoins ?? 0;
  const globalRank = problemStats?.rankInfo?.rank ?? null;
  const topPercent = problemStats?.rankInfo?.topPercent ?? null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Hero Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Solid Architectural Header Banner (Yellow in Light Mode, Obsidian in Dark Mode) */}
          <div className="h-40 sm:h-48 bg-amber-400 dark:bg-[#0B0F19] border-b-2 border-amber-600 dark:border-amber-500 relative overflow-hidden flex items-center justify-end px-6 sm:px-10 transition-colors duration-200">
            {/* Crisp Geometric Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(120,53,15,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,53,15,0.45) 1px, transparent 1px)',
                backgroundSize: '36px 36px'
              }}
            />

            {/* Subtle Haveli Arch & Diamond Blueprint Motif */}
            <svg
              className="absolute left-1/4 top-1/2 -translate-y-1/2 w-56 h-56 text-amber-950/15 dark:text-amber-500/10 pointer-events-none"
              viewBox="0 0 120 120"
              fill="none"
            >
              <polygon points="60,8 106,34 106,86 60,112 14,86 14,34" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="60,22 94,41 94,79 60,98 26,79 26,41" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="60" cy="60" r="14" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            {/* Floating Decorative Code Watermarks */}
            <span className="hidden lg:block absolute left-10 top-6 text-xs font-mono text-amber-950/45 dark:text-amber-400/35 select-none">
              const mastery = await solve();
            </span>
            <span className="hidden md:block absolute left-1/3 bottom-6 text-xs font-mono text-amber-950/45 dark:text-slate-400/35 select-none">
              &#123; &lt;/&gt; • O(log n) &#125;
            </span>

            {/* Solid Signature Italic CoderHaveli Crest */}
            <div className="relative z-10 flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#FFFBEB] dark:bg-[#131926] border border-amber-700/25 dark:border-amber-500/40 shadow-lg select-none">
              <div className="hidden sm:flex items-center justify-center p-1.5 rounded-xl bg-amber-500/15 border border-amber-600/25 dark:border-amber-500/30">
                <HaveliCoinIcon size={34} />
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span
                    className="text-3xl sm:text-5xl font-bold italic tracking-wide text-amber-700 dark:text-amber-400 pr-1"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    CoderHaveli
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-end gap-2">
                  <span className="h-[2px] w-8 bg-amber-600 dark:bg-amber-500 rounded-full" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-amber-900 dark:text-slate-300">
                    Code • Compete • Conquer
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative group w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 shadow-lg flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <RiAccountCircleLine className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <RiCameraFill className="text-white text-2xl" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Name & Handle */}
                <div className="pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {user.name || 'Coder'}
                    </h1>
                    {user.role === 'admin' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/40">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username || 'coder'} • {user.email}
                  </p>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-amber-500 text-white dark:text-gray-950 font-bold text-xs sm:text-sm hover:opacity-90 transition cursor-pointer"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <FaSave />
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stat Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {globalRank && (
                <Link
                  to="/leaderboard"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-purple-700 dark:text-purple-300 hover:scale-105 transition-transform"
                  title="View Tapasya Ranks Leaderboard"
                >
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span>Tapasya Rank #{globalRank} {topPercent ? `(Top ${topPercent}%)` : ''}</span>
                </Link>
              )}

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{solvedCount} / {problemStats?.totalProblems ?? 0} Solved</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-800 dark:text-amber-300">
                <HaveliCoinIcon size={18} />
                <span>{haveliCoins} Haveli Coins</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 text-xs font-bold text-orange-700 dark:text-orange-300">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>{currentStreak} Day Streak (Max: {longestStreak})</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Target className="w-4 h-4 text-blue-500" />
                <span>{acceptanceRate}% Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Unique CoderHaveli Coding Mastery Dashboard */}
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                CoderHaveli Mastery Overview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your overall DSA progress across Easy, Medium &amp; Hard challenges.
              </p>
            </div>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Solve More Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Unique Multi-Segment Hex-Crest Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-amber-50/40 to-orange-50/30 dark:from-gray-800/60 dark:via-gray-900 dark:to-amber-950/20 border border-amber-200/60 dark:border-gray-800">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Track Ring */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-800"
                    strokeWidth="12"
                  />
                  {/* Easy Segment (Emerald) */}
                  {easyArc > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(4, easyArc)} ${circumference}`}
                      strokeDashoffset={0}
                    />
                  )}
                  {/* Medium Segment (Amber) */}
                  {medArc > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(4, medArc)} ${circumference}`}
                      strokeDashoffset={-easyArc}
                    />
                  )}
                  {/* Hard Segment (Rose) */}
                  {hardArc > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(4, hardArc)} ${circumference}`}
                      strokeDashoffset={-(easyArc + medArc)}
                    />
                  )}
                </svg>

                {/* Center Crest Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">
                    {solvedCount}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 mt-1">
                    of {problemStats?.totalProblems ?? 0}
                  </div>
                  <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Solved
                  </span>
                </div>
              </div>

              {/* Sub-stats row */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-amber-200/50 dark:border-gray-800 text-center">
                <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white">{completionPct}%</div>
                  <div className="text-[10px] text-gray-500">Completion</div>
                </div>
                <div>
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400">{attemptingCount}</div>
                  <div className="text-[10px] text-gray-500">Attempting</div>
                </div>
                <div>
                  <div className="text-xs font-black text-blue-600 dark:text-blue-400">{totalSubmissions}</div>
                  <div className="text-[10px] text-gray-500">Submissions</div>
                </div>
              </div>
            </div>

            {/* Right: Easy / Medium / Hard Mastery Cards */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  label: 'Easy',
                  solved: easy.solved,
                  total: easy.total,
                  barClass: 'from-emerald-400 to-emerald-600',
                  bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-900/50',
                  textClass: 'text-emerald-700 dark:text-emerald-400'
                },
                {
                  label: 'Medium',
                  solved: medium.solved,
                  total: medium.total,
                  barClass: 'from-amber-400 to-orange-500',
                  bgClass: 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200/80 dark:border-amber-900/50',
                  textClass: 'text-amber-700 dark:text-amber-400'
                },
                {
                  label: 'Hard',
                  solved: hard.solved,
                  total: hard.total,
                  barClass: 'from-rose-400 to-rose-600',
                  bgClass: 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-200/80 dark:border-rose-900/50',
                  textClass: 'text-rose-700 dark:text-rose-400'
                }
              ].map((tier) => {
                const pct = tier.total > 0 ? Math.min(100, Math.round((tier.solved / tier.total) * 100)) : 0;
                return (
                  <div key={tier.label} className={`p-4 rounded-2xl border ${tier.bgClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${tier.textClass}`}>{tier.label}</span>
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                          ({pct}%)
                        </span>
                      </div>
                      <div className="text-sm font-black text-gray-900 dark:text-white">
                        {tier.solved}
                        <span className="text-xs font-semibold text-gray-400"> / {tier.total}</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/80 dark:bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${tier.barClass} transition-all duration-500`}
                        style={{ width: `${Math.max(tier.solved > 0 ? 3 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Two-Column: Haveli Coins Wallet + Personal Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Haveli Coins Wallet */}
          <div id="coins" className="lg:col-span-6 rounded-3xl bg-white dark:bg-gray-900 border border-amber-200/70 dark:border-amber-900/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/10 border-b border-amber-200/60 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/30">
                  <HaveliCoinIcon size={26} />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white">Haveli Coins Wallet</h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">POTD &amp; Weekly Contest Rewards</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                  <HaveliCoinIcon size={20} />
                  <span>{haveliCoins}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Personal AajKaSawal Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">Personal AajKaSawal Plan</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {coinSummary?.personalAajKaSawal?.isActive ? (
                        <>
                          Active •{' '}
                          <strong className="text-purple-600 dark:text-purple-400">
                            {coinSummary.personalAajKaSawal.selectedTopic || 'Standard POTD'}
                          </strong>
                        </>
                      ) : (
                        `Unlock custom topic POTD for ${coinSummary?.config?.personalPotdPrice ?? 50} Coins`
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  to="/practice"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0"
                >
                  <span>{coinSummary?.personalAajKaSawal?.isActive ? 'Topic' : 'Unlock'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Recent Coin Activity */}
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2.5">
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  Recent Coin Activity
                </h3>
                {coinSummary?.transactions?.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {coinSummary.transactions.slice(0, 8).map((tx) => (
                      <div key={tx._id} className="px-3.5 py-2.5 flex items-center justify-between text-xs bg-white dark:bg-gray-900">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{tx.reason}</p>
                          <p className="text-[10px] text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-black ${tx.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                          </span>
                          <div className="text-[10px] text-gray-400">Bal: {tx.balanceAfter}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center bg-slate-50 dark:bg-gray-800/30 rounded-xl">
                    No coin activity yet. Solve AajKaSawal or join Weekly Contests!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account & Personal Details */}
          <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <UserIcon className="w-4 h-4 text-amber-500" />
              Personal Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      defaultValue={user.name || ''}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white py-1">{user.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <p className="text-sm text-gray-700 dark:text-gray-300 py-1">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    {...register('phone')}
                    defaultValue={user.phone || ''}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 py-1">{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    {...register('bio')}
                    defaultValue={user.bio || ''}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 py-1">{user.bio || 'No bio yet'}</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Code2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
